import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { analyzeCrop, compareCropGrowth } from '../controllers/cropController.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/analyze', upload.single('image'), analyzeCrop);
router.post(
  '/compare',
  upload.fields([
    { name: 'day15Image', maxCount: 1 },
    { name: 'day30Image', maxCount: 1 }
  ]),
  compareCropGrowth
);

export default router;
