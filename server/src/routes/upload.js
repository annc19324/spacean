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
    params: {
        folder: 'spacean',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'pdf', 'zip', 'apk']
    },
});

const upload = multer({ storage: storage });

router.post('/', verifyToken, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Không có file nào được tải lên.' });
    }
    // Cloudinary returns the URL in req.file.path or req.file.secure_url
    res.json({ url: req.file.path || req.file.secure_url });
});

module.exports = router;
