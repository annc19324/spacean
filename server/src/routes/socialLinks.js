const express = require('express');
const router = express.Router();
const socialLinkController = require('../controllers/socialLinkController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Public route - anyone can view
router.get('/', socialLinkController.getSocialLinks);

// Admin routes
router.post('/', verifyToken, isAdmin, socialLinkController.createSocialLink);
router.put('/:id', verifyToken, isAdmin, socialLinkController.updateSocialLink);
router.delete('/:id', verifyToken, isAdmin, socialLinkController.deleteSocialLink);

module.exports = router;
