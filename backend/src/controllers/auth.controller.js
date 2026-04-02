const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
	return jwt.sign(
		{ id: user._id, role: user.role, username: user.username },
		process.env.JWT_SECRET || 'dev-secret',
		{ expiresIn: '7d' }
	);
}

exports.register = async (req, res) => {
	try {
		const { username, password, role } = req.body;
		if (!username || !password || !role) return res.status(400).json({ message: 'Missing fields' });
		if (!['student', 'staff', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
		
		// Validate email format
		if (!username.endsWith('@vit.edu.in')) {
			return res.status(400).json({ message: 'Username must be a VIT email address ending with @vit.edu.in' });
		}
		
		const existing = await User.findOne({ username });
		if (existing) return res.status(409).json({ message: 'Username taken' });
		const user = await User.create({ username, password, role });
		const token = signToken(user);
		return res.status(201).json({ token, user: { id: user._id, username: user.username, role: user.role } });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.login = async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) return res.status(400).json({ message: 'Missing fields' });
		
		// Validate email format
		if (!username.endsWith('@vit.edu.in')) {
			return res.status(400).json({ message: 'Username must be a VIT email address ending with @vit.edu.in' });
		}
		
		const user = await User.findOne({ username });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });
		const ok = await user.comparePassword(password);
		if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
		const token = signToken(user);
		return res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.getCurrentUser = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('_id username role createdAt');
		return res.json({ user });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
};
