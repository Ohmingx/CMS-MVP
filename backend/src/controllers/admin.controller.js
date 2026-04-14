const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const Order = require('../models/Order');
const Feedback = require('../models/Feedback');
const Announcement = require('../models/Announcement');
const { uploadToS3 } = require('../utils/s3');

exports.createMenuItem = async (req, res) => {
	try {
		const { name, price, description, imageUrl } = req.body;
		if (!name || price === undefined) return res.status(400).json({ message: 'Missing fields' });
		const item = await MenuItem.create({ name, price, description, imageUrl });
		return res.status(201).json({ item });
	} catch (err) {
		if (err.code === 11000) return res.status(409).json({ message: 'Item exists' });
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.updateMenuItem = async (req, res) => {
	try {
		const { name, price, description, isAvailable, imageUrl } = req.body;
		const item = await MenuItem.findByIdAndUpdate(
			req.params.id,
			{ $set: { name, price, description, isAvailable, imageUrl } },
			{ new: true }
		);
		if (!item) return res.status(404).json({ message: 'Not found' });
		return res.json({ item });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.uploadImage = async (req, res) => {
	try {
		if (!req.file) {
			console.error(JSON.stringify({ event: 'UploadFailure', reason: 'No file provided in request' }));
			return res.status(400).json({ message: 'No image file provided' });
		}
		
		const imageUrl = await uploadToS3(req.file.buffer, req.file.mimetype, req.file.originalname);
		
		// Structured log for CloudWatch
		console.log(JSON.stringify({
			event: 'ImageUploadSuccess',
			imageUrl,
			filename: req.file.originalname,
			size: req.file.size
		}));
		
		return res.status(200).json({ imageUrl });
	} catch (err) {
		// Structured log for CloudWatch
		console.error(JSON.stringify({
			event: 'ImageUploadError',
			error: err.message,
			stack: err.stack
		}));
		return res.status(500).json({ message: 'Failed to upload image' });
	}
};

exports.deleteMenuItem = async (req, res) => {
	try {
		const item = await MenuItem.findByIdAndDelete(req.params.id);
		if (!item) return res.status(404).json({ message: 'Not found' });
		return res.json({ success: true });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.getMenuItems = async (_req, res) => {
	try {
		const items = await MenuItem.find({}).sort({ name: 1 });
		return res.json({ items });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.getUsers = async (_req, res) => {
	try {
		const users = await User.find({}).select('_id username role createdAt');
		return res.json({ users });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: 'Not found' });
		if (user.role === 'admin') return res.status(400).json({ message: 'Cannot remove admin' });
		await user.deleteOne();
		return res.json({ success: true });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.getAnalytics = async (_req, res) => {
	try {
		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);

		const todayOrders = await Order.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
		const dailyRevenue = todayOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
		const totalOrders = await Order.countDocuments({});
		return res.json({ dailyRevenue, totalOrders, todayOrders: todayOrders.length });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.getFeedback = async (_req, res) => {
	try {
		const feedbacks = await Feedback.find({}).populate('studentId', 'username').sort({ createdAt: -1 });
		const formattedFeedbacks = feedbacks.map(f => ({
			...f.toObject(),
			studentName: f.studentId?.username || 'Anonymous'
		}));
		return res.json({ feedbacks: formattedFeedbacks });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.deleteFeedback = async (req, res) => {
	try {
		const feedback = await Feedback.findByIdAndDelete(req.params.id);
		if (!feedback) return res.status(404).json({ message: 'Not found' });
		return res.json({ success: true });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.getAnnouncements = async (_req, res) => {
	try {
		const announcements = await Announcement.find({}).populate('authorId', 'username').sort({ createdAt: -1 });
		const formattedAnnouncements = announcements.map(a => ({
			...a.toObject(),
			authorName: a.authorId?.username || 'Staff'
		}));
		return res.json({ announcements: formattedAnnouncements });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.deleteAnnouncement = async (req, res) => {
	try {
		const announcement = await Announcement.findByIdAndDelete(req.params.id);
		if (!announcement) return res.status(404).json({ message: 'Not found' });
		return res.json({ success: true });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};
