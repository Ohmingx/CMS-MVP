const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');

// Initialize S3 Client.
// When deployed on EC2 with an IAM role, AWS SDK automatically retrieves
// credentials from the instance metadata service.
// We still allow overriding via environment variables for local testing if needed.
const s3Client = new S3Client({
	region: process.env.AWS_REGION || 'ap-south-1', // Set your default region
});

/**
 * Uploads a file buffer to S3 under the /menu-items/ folder.
 * @param {Buffer} fileBuffer - The file buffer to upload.
 * @param {string} mimetype - The mime type of the file (e.g., image/jpeg).
 * @param {string} originalName - The original filename.
 * @returns {Promise<string>} - The public URL of the uploaded image.
 */
const uploadToS3 = async (fileBuffer, mimetype, originalName) => {
	const bucketName = process.env.S3_BUCKET_NAME;
	if (!bucketName) {
		throw new Error('S3_BUCKET_NAME is not configured in the environment variables.');
	}

	const extension = path.extname(originalName) || '.jpg';
	// Generate unique filename via UUID-like crypto randomness
	const randomName = crypto.randomBytes(16).toString('hex');
	const s3Filename = `menu-items/${randomName}${extension}`;

	const command = new PutObjectCommand({
		Bucket: bucketName,
		Key: s3Filename,
		Body: fileBuffer,
		ContentType: mimetype,
		// Making sure the object is publicly readable (requires appropriate bucket policies/ACLs)
		// But in a modern setting without ACLs, the bucket policy itself will handle public read access for a prefix.
	});

	try {
		await s3Client.send(command);
		// Return the constructed public URL
		return `https://${bucketName}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${s3Filename}`;
	} catch (error) {
		console.error("S3 Upload Error:", error);
		throw error;
	}
};

module.exports = {
	uploadToS3,
	s3Client
};
