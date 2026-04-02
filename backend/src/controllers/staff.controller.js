const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Feedback = require('../models/Feedback');

exports.getFeedback = async (_req, res) => {
	try {
		const feedbacks = await Feedback.find({}).populate('studentId', 'username').populate('orderId', 'items totalPrice').sort({ createdAt: -1 });
		const formattedFeedbacks = feedbacks.map(f => ({
			...f.toObject(),
			studentName: f.studentId?.username || 'Anonymous',
			orderDetails: f.orderId ? {
				orderId: f.orderId._id,
				items: f.orderId.items,
				totalPrice: f.orderId.totalPrice
			} : null
		}));
		return res.json({ feedbacks: formattedFeedbacks });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.getAllMenuItems = async (_req, res) => {
	try {
		const items = await MenuItem.find({}).sort({ name: 1 });
		return res.json({ items });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.toggleMenuAvailability = async (req, res) => {
	try {
		const item = await MenuItem.findById(req.params.id);
		if (!item) return res.status(404).json({ message: 'Not found' });
		item.isAvailable = !item.isAvailable;
		await item.save();
		return res.json({ item });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.getOrders = async (_req, res) => {
	try {
		const orders = await Order.find().sort({ createdAt: -1 }).populate('studentId', 'username');
		return res.json({ orders });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.updateOrderStatus = async (req, res) => {
	try {
		const { status } = req.body;
		if (!['placed', 'preparing', 'prepared', 'delivered'].includes(status)) {
			return res.status(400).json({ message: 'Invalid status' });
		}
		const order = await Order.findByIdAndUpdate(
			req.params.id,
			{ $set: { status } },
			{ new: true }
		);
		if (!order) return res.status(404).json({ message: 'Not found' });
		return res.json({ order });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};
