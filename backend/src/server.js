const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectToDatabase } = require('./utils/db');
const { bootstrapUsers } = require('./utils/bootstrapUsers');

// Routers
const authRouter = require('./routes/auth.routes');
const adminRouter = require('./routes/admin.routes');
const staffRouter = require('./routes/staff.routes');
const sharedRouter = require('./routes/shared.routes');

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
	origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? false : '*'),
	credentials: true,
}));
app.use(morgan('dev'));

// Health check
app.get('/health', (_req, res) => {
	return res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/staff', staffRouter);
app.use('/api', sharedRouter);

if (process.env.NODE_ENV === 'production') {
	const frontendPath = path.resolve(__dirname, '../../frontend/dist');
	const frontendIndex = path.join(frontendPath, 'index.html');

	if (fs.existsSync(frontendIndex)) {
		app.use(express.static(frontendPath));
		app.use((req, res, next) => {
			if (req.method !== 'GET' || req.path === '/health' || req.path === '/api' || req.path.startsWith('/api/')) {
				return next();
			}
			return res.sendFile(frontendIndex);
		});
	}
}

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
	console.error(err);
	const status = err.status || 500;
	return res.status(status).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

async function start() {
	try {
		if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
			throw new Error('JWT_SECRET is required in production');
		}
		const databaseUri = process.env.MONGODB_URI || (
			process.env.NODE_ENV === 'production' ? undefined : 'mongodb://localhost:27017/canteen_db'
		);
		await connectToDatabase(databaseUri);
		await bootstrapUsers();
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	} catch (error) {
		console.error('Failed to start server', error);
		process.exit(1);
	}
}

start();

module.exports = app;
