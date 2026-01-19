const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Người dùng đã tồn tại.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user - isApproved will be false by default as per schema
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: 'USER',
                isApproved: false, // Explicitly set or rely on default
            },
        });

        res.status(201).json({
            message: 'Đăng ký thành công! Vui lòng chờ Admin phê duyệt tài khoản của bạn.',
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi đăng ký.' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không chính xác.' });
        }

        // Check if approved
        if (!user.isApproved && user.role !== 'ADMIN') {
            return res.status(403).json({
                message: 'Tài khoản của bạn đang chờ phê duyệt. Vui lòng liên hệ Admin.'
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                isApproved: user.isApproved
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
    }
};

module.exports = { register, login };
