const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation rules
        const usernameRegex = /^[a-zA-Z0-9.]{6,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                message: 'Username phải ít nhất 6 ký tự, chỉ bao gồm chữ cái, số và dấu chấm. Không được chứa khoảng trắng.'
            });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password phải ít nhất 8 kí tự, bao gồm ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 kí tự đặc biệt.'
            });
        }

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

        // Check if banned
        if (user.status === 'BANNED') {
            return res.status(403).json({
                message: 'Tài khoản của bạn đã bị cấm khỏi hệ thống.'
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
                isApproved: user.isApproved,
                bio: user.bio,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
    }
};

module.exports = { register, login };
