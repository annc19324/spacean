const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        const users = await prisma.user.findMany({
            where: { role: { not: 'ADMIN' } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng.' });
    }
};

const updateUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, bio, role, status, isApproved } = req.body;
        const updated = await prisma.user.update({
            where: { id },
            data: { username, bio, role, status, isApproved }
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
        const apps = await prisma.app.findMany({
            include: { user: { select: { username: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách ứng dụng.' });
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
    deleteAppAdmin
};
