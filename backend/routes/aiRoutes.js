import express from 'express';
import { generateAIResponse, getChatHistory } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate', generateAIResponse);
router.get('/history', getChatHistory);

export default router;
