const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
	authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	title: { type: String, required: true },
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
