const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const prisma = new PrismaClient();

// Get list of pending users
router.get('/pending-users', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { isApproved: false, role: 'USER' },
            select: { id: true, username: true, joinDate: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách chờ.' });
    }
});

// Approve a user
router.put('/approve/:id', verifyToken, isAdmin, async (req, res) => {
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
});

module.exports = router;
