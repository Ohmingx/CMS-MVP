const express = require('express');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const staffController = require('../controllers/staff.controller');

const router = express.Router();

// All staff routes require staff role
router.use(authenticate, authorizeRoles('staff'));

router.get('/feedback', staffController.getFeedback);
router.get('/menu/all', staffController.getAllMenuItems);
router.put('/menu/availability/:id', staffController.toggleMenuAvailability);
router.get('/orders', staffController.getOrders);
router.put('/orders/status/:id', staffController.updateOrderStatus);

module.exports = router;
