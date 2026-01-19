const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createApp = async (req, res) => {
    try {
        const { name, description, type, link, downloadUrl, imageUrl } = req.body;
        const userId = req.user.id;

        const newApp = await prisma.app.create({
            data: {
                name,
                description,
                type,
                link,
                downloadUrl,
                imageUrl,
                userId
            }
        });

        res.status(201).json(newApp);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi tạo ứng dụng.' });
    }
};

const getUserApps = async (req, res) => {
    try {
        const apps = await prisma.app.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách ứng dụng.' });
    }
};

const getPublicApps = async (req, res) => {
    try {
        const apps = await prisma.app.findMany({
            include: {
                user: {
                    select: { username: true, joinDate: true, views: true, likes: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách ứng dụng công khai.' });
    }
};

const updateApp = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, type, link, downloadUrl, imageUrl } = req.body;

        // Check ownership
        const existingApp = await prisma.app.findUnique({ where: { id } });
        if (!existingApp || existingApp.userId !== req.user.id) {
            return res.status(403).json({ message: 'Bạn không có quyền sửa ứng dụng này.' });
        }

        const updatedApp = await prisma.app.update({
            where: { id },
            data: { name, description, type, link, downloadUrl, imageUrl }
        });

        res.json(updatedApp);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật ứng dụng.' });
    }
};

const deleteApp = async (req, res) => {
    try {
        const { id } = req.params;
        const existingApp = await prisma.app.findUnique({ where: { id } });
        if (!existingApp || existingApp.userId !== req.user.id) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa ứng dụng này.' });
        }

        await prisma.app.delete({ where: { id } });
        res.json({ message: 'Đã xóa ứng dụng thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa ứng dụng.' });
    }
};

const getAppStats = async (req, res) => {
    try {
        const { id } = req.params;
        const app = await prisma.app.findUnique({
            where: { id },
            include: { user: { select: { username: true } } }
        });

        if (!app) return res.status(404).json({ message: 'Ứng dụng không tìm thấy.' });

        // Increment views automatically when stats are requested (simple tracking)
        await prisma.app.update({
            where: { id },
            data: { views: { increment: 1 } }
        });

        res.json(app);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông số ứng dụng.' });
    }
};

module.exports = {
    createApp,
    getUserApps,
    getPublicApps,
    updateApp,
    deleteApp,
    getAppStats
};
