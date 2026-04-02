const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Feedback = require('../models/Feedback');
const Announcement = require('../models/Announcement');

exports.getMenu = async (_req, res) => {
	try {
		const items = await MenuItem.find({ isAvailable: true }).sort({ name: 1 });
		return res.json({ items });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.createOrder = async (req, res) => {
	try {
		const { items } = req.body; // [{menuItemId, name, quantity, price}]
		if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' });
		const totalPrice = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
		const order = await Order.create({ studentId: req.user.id, items, totalPrice });
		return res.status(201).json({ order });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.getMyOrders = async (req, res) => {
	try {
		const orders = await Order.find({ studentId: req.user.id }).sort({ createdAt: -1 });
		return res.json({ orders });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.createAnnouncement = async (req, res) => {
	try {
		const { title, content } = req.body;
		if (!title || !content) return res.status(400).json({ message: 'Missing fields' });
		const ann = await Announcement.create({ authorId: req.user.id, title, content });
		return res.status(201).json({ announcement: ann });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.getAnnouncements = async (_req, res) => {
	try {
		const anns = await Announcement.find().sort({ createdAt: -1 }).populate('authorId', 'username role');
		return res.json({ announcements: anns });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.createFeedback = async (req, res) => {
	try {
		const { orderId, rating, comment, suggestions } = req.body;
		if (!orderId || !rating || !comment) return res.status(400).json({ message: 'Missing fields' });
		if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1-5' });
		
		// Check if order exists and belongs to student
		const order = await Order.findOne({ _id: orderId, studentId: req.user.id });
		if (!order) return res.status(404).json({ message: 'Order not found' });
		
		// Check if feedback already exists for this order
		const existingFeedback = await Feedback.findOne({ orderId });
		if (existingFeedback) return res.status(409).json({ message: 'Feedback already submitted for this order' });
		
		const feedback = await Feedback.create({ 
			studentId: req.user.id, 
			orderId, 
			rating, 
			comment, 
			suggestions: suggestions || '' 
		});
		return res.status(201).json({ feedback });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.getInvoice = async (req, res) => {
	try {
		const order = await Order.findOne({ 
			_id: req.params.orderId, 
			studentId: req.user.id 
		}).populate('studentId', 'username');
		
		if (!order) return res.status(404).json({ message: 'Order not found' });
		
		// Mark invoice as generated
		await Order.findByIdAndUpdate(order._id, { invoiceGenerated: true });
		
		return res.json({ 
			invoice: {
				orderId: order._id,
				studentName: order.studentId.username,
				items: order.items,
				totalPrice: order.totalPrice,
				status: order.status,
				createdAt: order.createdAt,
				invoiceDate: new Date()
			}
		});
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};
