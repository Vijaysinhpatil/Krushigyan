import express from 'express';
import { getCurrentUser, signup, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', getCurrentUser);

export default router;
