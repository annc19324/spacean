const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Không có token, quyền truy cập bị từ chối.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Active check user status
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return res.status(404).json({ message: 'Người đang tham gia không gian này không tồn tại.' });
        }

        if (user.status === 'BANNED') {
            return res.status(403).json({ message: 'Tài khoản của bạn đã bị cấm khỏi hệ thống.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Phiên đăng nhập hết hạn hoặc Token không hợp lệ.' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Truy cập bị từ chối. Chỉ dành cho Admin.' });
    }
};

module.exports = { verifyToken, isAdmin };
