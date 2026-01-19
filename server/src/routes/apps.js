const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/public', appController.getPublicApps); // For Guests to see
router.get('/my-apps', verifyToken, appController.getUserApps); // For logged in users
router.post('/', verifyToken, appController.createApp);
router.put('/:id', verifyToken, appController.updateApp);
router.delete('/:id', verifyToken, appController.deleteApp);
router.get('/stats/:id', appController.getAppStats); // Specific app stats
router.post('/like/:id', verifyToken, appController.likeApp);
router.post('/dislike/:id', verifyToken, appController.dislikeApp);
router.post('/download/:id', appController.downloadApp);
router.post('/view/:id', appController.incrementAppViews);

module.exports = router;
