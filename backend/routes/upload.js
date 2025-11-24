const express = require('express');
const router = express.Router();
const multer = require('multer');

const uploadController = require('../controllers/uploadController');

// configure multer
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('zipfile'), uploadController.handleUpload);

module.exports = router;
