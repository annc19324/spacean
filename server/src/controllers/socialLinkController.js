const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Public - Get all social links
const getSocialLinks = async (req, res) => {
    try {
        const links = await prisma.socialLink.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(links);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách liên kết.' });
    }
};

// Admin - Create social link
const createSocialLink = async (req, res) => {
    try {
        const { name, iconType, iconUrl, url, order } = req.body;
        const newLink = await prisma.socialLink.create({
            data: { name, iconType, iconUrl, url, order: order || 0 }
        });
        res.status(201).json(newLink);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo liên kết.' });
    }
};

// Admin - Update social link
const updateSocialLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, iconType, iconUrl, url, order } = req.body;
        const updated = await prisma.socialLink.update({
            where: { id },
            data: { name, iconType, iconUrl, url, order }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật liên kết.' });
    }
};

// Admin - Delete social link
const deleteSocialLink = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.socialLink.delete({ where: { id } });
        res.json({ message: 'Đã xóa liên kết!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa liên kết.' });
    }
};

module.exports = {
    getSocialLinks,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink
};
