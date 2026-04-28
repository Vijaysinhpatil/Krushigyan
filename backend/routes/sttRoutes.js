import express from 'express';
import multer from 'multer';
import path from 'path';
import { transcribeAudio } from '../controllers/sttController.js';

const router = express.Router();

// Reuse your existing upload logic for consistency
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `speech-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for audio
});

router.get('/test', (req, res) => {
  res.json({ message: 'STT route is working' });
});


// Endpoint to handle audio-to-text conversion
router.post('/transcribe', upload.single('audio'), transcribeAudio);

export default router;