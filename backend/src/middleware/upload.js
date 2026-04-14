const multer = require('multer');

// Configure multer to use memory storage.
// This buffers the file in memory, enabling us to access the buffer
// directly and pipe it to S3, without saving it temporarily to the disk.
const storage = multer.memoryStorage();

// File filter to validate image format
const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
		cb(null, true);
	} else {
		cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
	}
};

// Create the upload middleware
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 2 * 1024 * 1024 // 2 MB limit max
	}
});

module.exports = upload;
