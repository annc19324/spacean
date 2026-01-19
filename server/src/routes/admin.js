const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Approval flow
router.get('/pending-users', verifyToken, isAdmin, adminController.getPendingUsers);
router.put('/approve/:id', verifyToken, isAdmin, adminController.approveUser);

// User Management (Supreme Power)
router.get('/users', verifyToken, isAdmin, adminController.getAllUsersAdmin);
router.put('/users/:id', verifyToken, isAdmin, adminController.updateUserAdmin);
router.delete('/users/:id', verifyToken, isAdmin, adminController.deleteUserAdmin);

// App Management (Supreme Power)
router.get('/apps', verifyToken, isAdmin, adminController.getAllAppsAdmin);
router.delete('/apps/:id', verifyToken, isAdmin, adminController.deleteAppAdmin);

module.exports = router;
