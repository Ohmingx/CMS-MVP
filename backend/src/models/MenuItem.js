const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true, trim: true },
	price: { type: Number, required: true, min: 0 },
	description: { type: String, default: '' },
	isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
