const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'resumes', // Cloudinary folder name
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw', // Required for non-image files like PDF/DOC
  },
});

const upload = multer({ storage });

module.exports = upload;
