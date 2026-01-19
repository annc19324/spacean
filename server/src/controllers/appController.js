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
            include: { user: { select: { username: true, joinDate: true, views: true, likes: true, dislikes: true, downloads: true } } }
        });

        if (!app) return res.status(404).json({ message: 'Ứng dụng không tìm thấy.' });

        res.json(app);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông số ứng dụng.' });
    }
};

const incrementAppViews = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.app.update({
            where: { id },
            data: {
                views: { increment: 1 },
                user: {
                    update: { views: { increment: 1 } }
                }
            }
        });
        res.json({ message: 'Đã tăng lượt xem ứng dụng' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tăng lượt xem' });
    }
};

const likeApp = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!id || !userId) {
            return res.status(400).json({ message: 'Thiếu thông tin ứng dụng hoặc người dùng.' });
        }

        const existing = await prisma.interaction.findUnique({
            where: {
                userId_appId: { userId, appId: id }
            }
        });

        if (existing) {
            return res.status(400).json({ message: 'Bạn đã thích hoặc không thích ứng dụng này rồi.' });
        }

        const app = await prisma.app.update({
            where: { id },
            data: {
                likes: { increment: 1 },
                user: { update: { likes: { increment: 1 } } }
            }
        });

        await prisma.interaction.create({
            data: { type: 'LIKE', userId, appId: id }
        });

        res.json({ message: 'Đã thích ứng dụng!', likes: app.likes });
    } catch (error) {
        console.error("Internal Error in likeApp:", error);
        res.status(500).json({ message: 'Lỗi server khi thực hiện thích ứng dụng.' });
    }
};

const dislikeApp = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!id || !userId) {
            return res.status(400).json({ message: 'Thiếu thông tin ứng dụng hoặc người dùng.' });
        }

        const existing = await prisma.interaction.findUnique({
            where: {
                userId_appId: { userId, appId: id }
            }
        });

        if (existing) {
            return res.status(400).json({ message: 'Bạn đã thích hoặc không thích ứng dụng này rồi.' });
        }

        const app = await prisma.app.update({
            where: { id },
            data: {
                dislikes: { increment: 1 },
                user: { update: { dislikes: { increment: 1 } } }
            }
        });

        await prisma.interaction.create({
            data: { type: 'DISLIKE', userId, appId: id }
        });

        res.json({ message: 'Đã không thích ứng dụng.', dislikes: app.dislikes });
    } catch (error) {
        console.error("Internal Error in dislikeApp:", error);
        res.status(500).json({ message: 'Lỗi server khi thực hiện không thích ứng dụng.' });
    }
};

const downloadApp = async (req, res) => {
    try {
        const { id } = req.params;
        const app = await prisma.app.update({
            where: { id },
            data: {
                downloads: { increment: 1 },
                user: {
                    update: { downloads: { increment: 1 } }
                }
            }
        });
        res.json({ message: 'Đang bắt đầu tải xuống...', downloads: app.downloads });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tải ứng dụng.' });
    }
};

const unlikeApp = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const existing = await prisma.interaction.findUnique({
            where: { userId_appId: { userId, appId: id } }
        });

        if (!existing || existing.type !== 'LIKE') {
            return res.status(400).json({ message: 'Bạn chưa thích ứng dụng này.' });
        }

        await prisma.interaction.delete({
            where: { userId_appId: { userId, appId: id } }
        });

        const app = await prisma.app.update({
            where: { id },
            data: {
                likes: { decrement: 1 },
                user: { update: { likes: { decrement: 1 } } }
            }
        });

        res.json({ message: 'Đã bỏ thích!', likes: app.likes });
    } catch (error) {
        console.error("Internal Error in unlikeApp:", error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

const undislikeApp = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const existing = await prisma.interaction.findUnique({
            where: { userId_appId: { userId, appId: id } }
        });

        if (!existing || existing.type !== 'DISLIKE') {
            return res.status(400).json({ message: 'Bạn chưa ghét ứng dụng này.' });
        }

        await prisma.interaction.delete({
            where: { userId_appId: { userId, appId: id } }
        });

        const app = await prisma.app.update({
            where: { id },
            data: {
                dislikes: { decrement: 1 },
                user: { update: { dislikes: { decrement: 1 } } }
            }
        });

        res.json({ message: 'Đã bỏ ghét!', dislikes: app.dislikes });
    } catch (error) {
        console.error("Internal Error in undislikeApp:", error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

module.exports = {
    createApp,
    getUserApps,
    getPublicApps,
    updateApp,
    deleteApp,
    getAppStats,
    likeApp,
    dislikeApp,
    unlikeApp,
    undislikeApp,
    downloadApp,
    incrementAppViews
};
