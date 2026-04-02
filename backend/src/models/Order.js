const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
	menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
	name: { type: String, required: true },
	quantity: { type: Number, required: true, min: 1 },
	price: { type: Number, required: true, min: 0 },
});

const OrderSchema = new mongoose.Schema({
	studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	items: { type: [OrderItemSchema], default: [] },
	totalPrice: { type: Number, required: true, min: 0 },
	status: { type: String, enum: ['placed', 'preparing', 'prepared', 'delivered'], default: 'placed' },
	invoiceGenerated: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
