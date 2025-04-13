const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadmiddleware');
const { uploadFile } = require('../controllers/uploadcontroller');
const verifyToken = require('../middleware/authmiddleware');

// Route should be POST /api/upload
router.post('/', verifyToken, upload.single('file'), uploadFile);

module.exports = router;
