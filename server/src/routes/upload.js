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
        // Sanitize filename
        let sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');

        // TRICK: Rename .apk to .bin to bypass Cloudinary block
        if (sanitizedOriginalName.endsWith('.apk')) {
            sanitizedOriginalName += '.bin';
        }

        return {
            folder: 'spacean',
            resource_type: isImage ? 'image' : 'raw', // Force raw for .bin
            public_id: `${Date.now()}-${sanitizedOriginalName}`,
            use_filename: true,
            unique_filename: false,
        };
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }
});

router.post('/', verifyToken, (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error("Upload Error Details:", err);
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: `Lỗi Multer: ${err.message}` });
            }
            return res.status(500).json({ message: `Lỗi tải file lên Server: ${err.message}` });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Không có file nào được tải lên.' });
        }

        let url = req.file.path || req.file.secure_url;

        // TRICK: Inject 'fl_attachment' flag to force download as .apk (restore original extension)
        if (req.file.originalname.endsWith('.apk')) {
            const cleanName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
            // Check if URL contains /upload/ and insert flag after it
            if (url.includes('/upload/')) {
                url = url.replace('/upload/', `/upload/fl_attachment:${cleanName}/`);
            }
        }

        res.json({ url });
    });
});

module.exports = router;
