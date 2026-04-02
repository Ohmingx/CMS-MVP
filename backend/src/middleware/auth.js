const jwt = require('jsonwebtoken');
const User = require('../models/User');

function authenticate(req, res, next) {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
	if (!token) return res.status(401).json({ message: 'Unauthorized' });
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
		req.user = { id: payload.id, role: payload.role, username: payload.username };
		return next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token' });
	}
}

function authorizeRoles(...roles) {
	return (req, res, next) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		return next();
	};
}

module.exports = { authenticate, authorizeRoles };
