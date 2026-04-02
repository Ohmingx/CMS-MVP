const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectToDatabase } = require('./utils/db');

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
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
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

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../../frontend/dist')));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../../frontend/dist', 'index.html'));
	});
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
		await connectToDatabase(process.env.MONGODB_URI || 'mongodb://localhost:27017/canteen_db');
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	} catch (error) {
		console.error('Failed to start server', error);
		process.exit(1);
	}
}

start();

module.exports = app;
