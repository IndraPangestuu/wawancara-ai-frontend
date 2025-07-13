const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiController = require('../controllers/aiController');
const healthController = require('../controllers/healthController');

// Konfigurasi multer untuk menangani file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Endpoint kesehatan
router.get('/health', healthController.healthCheck);

// Endpoint transkripsi audio
router.post('/transcribe', upload.single('audio'), aiController.transcribe);

// Endpoint generate jawaban
router.post('/generate-answer', aiController.generateAnswer);

module.exports = router;