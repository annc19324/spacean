const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { verifyToken } = require('../middlewares/authMiddleware');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isImage = file.mimetype.startsWith('image/');
        // Sanitize filename: remove special chars, keep alphanumeric, dots, dashes, underscores
        const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        return {
            folder: 'spacean',
            resource_type: 'auto', // Let Cloudinary decide
            public_id: `${Date.now()}-${sanitizedOriginalName}`,
            use_filename: true,
            unique_filename: false,
        };
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

router.post('/', verifyToken, (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error("Upload Error Details:", err);
            // Check for specific Multer errors
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: `Lỗi Multer: ${err.message}` });
            }
            // Check for Cloudinary errors (often wrapped in standard Error)
            return res.status(500).json({ message: `Lỗi tải file lên Server: ${err.message}` });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Không có file nào được tải lên.' });
        }

        // Cloudinary returns the URL in req.file.path or req.file.secure_url
        res.json({ url: req.file.path || req.file.secure_url });
    });
});

module.exports = router;
