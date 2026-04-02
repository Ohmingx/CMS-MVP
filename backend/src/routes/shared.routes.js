const express = require('express');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const sharedController = require('../controllers/shared.controller');

const router = express.Router();

router.get('/menu', authenticate, sharedController.getMenu);

router.post('/orders', authenticate, authorizeRoles('student'), sharedController.createOrder);
router.get('/orders/my-orders', authenticate, authorizeRoles('student'), sharedController.getMyOrders);

router.post('/announcements', authenticate, authorizeRoles('admin', 'staff'), sharedController.createAnnouncement);
router.get('/announcements', authenticate, sharedController.getAnnouncements);

router.post('/feedback', authenticate, authorizeRoles('student'), sharedController.createFeedback);
router.get('/invoice/:orderId', authenticate, authorizeRoles('student'), sharedController.getInvoice);

module.exports = router;
