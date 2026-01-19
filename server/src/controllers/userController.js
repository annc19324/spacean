const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                apps: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng này.' });

        // Hide sensitive info
        const { password, ...publicUser } = user;
        res.json(publicUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy thông tin hồ sơ.' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { isApproved: true },
            select: {
                id: true,
                username: true,
                avatar: true,
                joinDate: true,
                views: true,
                likes: true,
                _count: {
                    select: { apps: true }
                }
            },
            orderBy: { views: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng.' });
    }
};

const incrementUserViews = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.update({
            where: { id },
            data: { views: { increment: 1 } }
        });
        res.json({ message: 'Đã tăng lượt xem hồ sơ' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tăng lượt xem' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, bio, avatar } = req.body;

        // Optional: Check if username is taken if it's being changed
        if (username) {
            const existing = await prisma.user.findFirst({
                where: { username, NOT: { id: userId } }
            });
            if (existing) return res.status(400).json({ message: 'Tên đăng nhập này đã có người sử dụng.' });
        }

        const updated = await prisma.user.update({
            where: { id: userId },
            data: { username, bio, avatar }
        });

        res.json({ message: 'Đã cập nhật hồ sơ!', user: { id: updated.id, username: updated.username, bio: updated.bio, avatar: updated.avatar } });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật hồ sơ.' });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Đã đổi mật khẩu thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi đổi mật khẩu.' });
    }
};

module.exports = {
    getPublicProfile,
    getAllUsers,
    incrementUserViews,
    updateProfile,
    changePassword
};
