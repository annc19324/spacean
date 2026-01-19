const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', userController.getAllUsers);
router.get('/:username', userController.getPublicProfile);
router.post('/view/:id', userController.incrementUserViews);

router.put('/profile', verifyToken, userController.updateProfile);
router.put('/change-password', verifyToken, userController.changePassword);

module.exports = router;
