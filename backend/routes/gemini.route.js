import express from "express";
import { generateGeminiResponse } from "../controller/gemini.controller.js";

const router = express.Router();

router.post("/generate", generateGeminiResponse);

export default router;