const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

module.exports = {
    getPublicProfile,
    getAllUsers,
    incrementUserViews
};
