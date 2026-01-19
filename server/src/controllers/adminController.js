const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

const getPendingUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { isApproved: false, role: 'USER' },
            select: { id: true, username: true, joinDate: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách chờ.' });
    }
};

const approveUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.update({
            where: { id },
            data: { isApproved: true }
        });
        res.json({ message: 'Đã phê duyệt người dùng.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi phê duyệt.' });
    }
};

const getAllUsersAdmin = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const where = {
            role: { not: 'ADMIN' },
            ...(search && {
                OR: [
                    { username: { contains: search, mode: 'insensitive' } },
                    { id: { contains: search, mode: 'insensitive' } }
                ]
            })
        };

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: parseInt(skip),
                take: parseInt(limit)
            }),
            prisma.user.count({ where })
        ]);

        res.json({ users, total, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng.' });
    }
};

const updateUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, bio, role, status, isApproved, password, views, likes, dislikes, downloads } = req.body;

        let data = { username, bio, role, status, isApproved, views, likes, dislikes, downloads };

        // If password is provided, hash it
        if (password && password.trim() !== '') {
            data.password = await bcrypt.hash(password, 10);
        }

        const updated = await prisma.user.update({
            where: { id },
            data
        });
        res.json({ message: 'Đã cập nhật thông tin người dùng.', user: updated });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật người dùng.' });
    }
};

const deleteUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        // Cascade delete if necessary, or Prisma handles it if configured
        await prisma.app.deleteMany({ where: { userId: id } });
        await prisma.interaction.deleteMany({ where: { userId: id } });
        await prisma.user.delete({ where: { id } });
        res.json({ message: 'Đã xóa người dùng và dữ liệu liên quan.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa người dùng.' });
    }
};

const getAllAppsAdmin = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const where = {
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ]
            })
        };

        const [apps, total] = await Promise.all([
            prisma.app.findMany({
                where,
                include: { user: { select: { username: true } } },
                orderBy: { createdAt: 'desc' },
                skip: parseInt(skip),
                take: parseInt(limit)
            }),
            prisma.app.count({ where })
        ]);

        res.json({ apps, total, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách ứng dụng.' });
    }
};

const updateAppAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, type, link, downloadUrl, imageUrl, views, likes, dislikes, downloads } = req.body;
        const updated = await prisma.app.update({
            where: { id },
            data: { name, description, type, link, downloadUrl, imageUrl, views, likes, dislikes, downloads }
        });
        res.json({ message: 'Đã cập nhật thông tin ứng dụng.', app: updated });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật ứng dụng.' });
    }
};

const deleteAppAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.interaction.deleteMany({ where: { appId: id } });
        await prisma.app.delete({ where: { id } });
        res.json({ message: 'Đã xóa ứng dụng thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa ứng dụng.' });
    }
};

module.exports = {
    getPendingUsers,
    approveUser,
    getAllUsersAdmin,
    updateUserAdmin,
    deleteUserAdmin,
    getAllAppsAdmin,
    updateAppAdmin,
    deleteAppAdmin
};
