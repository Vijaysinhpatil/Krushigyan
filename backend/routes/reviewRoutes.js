import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { 
  createPost, 
  getPosts, 
  addSuggestion, 
  markHelpful, 
  markBest 
} from '../controllers/reviewController.js';

const router = express.Router();

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
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', upload.single('image'), createPost);
router.get('/', getPosts);
router.post('/:id/comment', addSuggestion);
router.patch('/:id/helpful/:suggestionId', markHelpful);
router.patch('/:id/best/:suggestionId', markBest);

export default router;
