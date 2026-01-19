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
        // For non-image files (like APK), use 'raw' resource_type and preserve extension
        return {
            folder: 'spacean',
            resource_type: isImage ? 'image' : 'raw',
            public_id: `${Date.now()}-${file.originalname}`, // Keep original name/ext for raw files to ensure download works
            format: isImage ? 'png' : undefined, // Let images convert to png (optional), raw files keep original format
            use_filename: true,
            unique_filename: false,
        };
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

router.post('/', verifyToken, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Không có file nào được tải lên.' });
    }
    // Cloudinary returns the URL in req.file.path or req.file.secure_url
    res.json({ url: req.file.path || req.file.secure_url });
});

module.exports = router;
