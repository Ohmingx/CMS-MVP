const express = require('express');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

// Admin-only
router.use(authenticate, authorizeRoles('admin'));

router.post('/menu', adminController.createMenuItem);
router.post('/menu/upload', upload.single('image'), adminController.uploadImage);
router.put('/menu/:id', adminController.updateMenuItem);
router.delete('/menu/:id', adminController.deleteMenuItem);
router.get('/menu', adminController.getMenuItems);

router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);

router.get('/analytics', adminController.getAnalytics);

router.get('/feedback', adminController.getFeedback);
router.delete('/feedback/:id', adminController.deleteFeedback);

router.get('/announcements', adminController.getAnnouncements);
router.delete('/announcements/:id', adminController.deleteAnnouncement);

module.exports = router;
