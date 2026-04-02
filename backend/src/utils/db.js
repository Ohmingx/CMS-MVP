const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase(uri) {
	if (isConnected) {
		return mongoose.connection;
	}
	if (!uri) {
		throw new Error('MONGODB_URI is not provided');
	}
	mongoose.set('strictQuery', true);
	await mongoose.connect(uri, {
		serverSelectionTimeoutMS: 10000,
	});
	isConnected = true;
	console.log('Connected to MongoDB');
	return mongoose.connection;
}

module.exports = { connectToDatabase };
