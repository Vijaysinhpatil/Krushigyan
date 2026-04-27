import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import CropAnalysis from '../models/CropAnalysis.js';

export const analyzeCrop = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const { language = 'en' } = req.body;
    
    // Check API Key
    if (!process.env.GEMINI_API_KEY) {
      console.error('API Key missing in environment variables');
      return res.status(500).json({ success: false, message: 'Gemini API key not configured' });
    }

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_fallback';
    let userId = null;

    if (token) {
      try {
        userId = jwt.verify(token, jwtSecret).userId;
      } catch {
        userId = null;
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Note: The user's API key returned 404 for gemini-1.5-flash, so we fallback to gemini-2.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Read file and convert to base64
    const fileBytes = fs.readFileSync(req.file.path);
    const base64Data = fileBytes.toString('base64');
    const mimeType = req.file.mimetype;

    const languageMap = {
      en: 'English',
      hi: 'Hindi',
      mr: 'Marathi',
      kn: 'Kannada'
    };
    
    const selectedLang = languageMap[language] || 'English';

    const prompt = `Analyze this crop image. Detect any disease or issue. 
    Provide the output strictly in ${selectedLang} language as a JSON object with the following structure:
    {
      "detectedDisease": "Name of the disease or issue",
      "solution": "Detailed solution or remedy",
      "precautions": "Precautions to take for the future",
      "treatmentSteps": "Step by step treatment guide"
    }
    Ensure the response is valid JSON and contains only the JSON object. Do not wrap it in markdown code blocks.`;

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = result.response;
    let resultText = response.text();

    // Strip markdown JSON wrapping if present
    if (resultText.startsWith('\`\`\`json')) {
      resultText = resultText.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (resultText.startsWith('\`\`\`')) {
      resultText = resultText.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(resultText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', resultText);
      return res.status(500).json({ success: false, message: 'Invalid response from AI' });
    }

    // Save to MongoDB
    const newAnalysis = new CropAnalysis({
      userId,
      imageUrl: req.file.path, // In a real app, this should be uploaded to a cloud storage like Cloudinary or S3
      detectedDisease: parsedResult.detectedDisease,
      solution: parsedResult.solution,
      precautions: parsedResult.precautions,
      treatmentSteps: parsedResult.treatmentSteps,
      language: language
    });

    await newAnalysis.save();

    res.status(200).json({
      success: true,
      data: parsedResult
    });
  } catch (error) {
    console.error('Crop Analysis Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error during analysis' });
  }
};

export const compareCropGrowth = async (req, res) => {
  try {
    if (!req.files?.day15Image?.[0] || !req.files?.day30Image?.[0]) {
      return res.status(400).json({
        success: false,
        message: 'Both Day 15 and Day 30 images are required'
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('API Key missing in environment variables');
      return res.status(500).json({ success: false, message: 'Gemini API key not configured' });
    }

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_fallback';
    let userId = null;

    if (token) {
      try {
        userId = jwt.verify(token, jwtSecret).userId;
      } catch {
        userId = null;
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const day15Bytes = fs.readFileSync(req.files.day15Image[0].path);
    const day30Bytes = fs.readFileSync(req.files.day30Image[0].path);

    const day15Base64 = day15Bytes.toString('base64');
    const day30Base64 = day30Bytes.toString('base64');
    const day15MimeType = req.files.day15Image[0].mimetype;
    const day30MimeType = req.files.day30Image[0].mimetype;

    const prompt = `Compare these two crop images taken on Day 15 and Day 30.
Provide concise but useful farming advice based on visible changes.

Return ONLY valid JSON in this structure:
{
  "cropHealthComparison": "Summary of overall change between the two dates",
  "growthAnalysis": "Specific growth metrics or visual improvements",
  "revenueOptimization": "Expected yield or business impact",
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ]
}

Do not wrap the response in markdown code blocks.`;

    const imageParts = [
      {
        inlineData: {
          data: day15Base64,
          mimeType: day15MimeType
        }
      },
      {
        inlineData: {
          data: day30Base64,
          mimeType: day30MimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = result.response;
    let resultText = response.text();

    if (resultText.startsWith('```json')) {
      resultText = resultText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (resultText.startsWith('```')) {
      resultText = resultText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(resultText);
    } catch (parseError) {
      console.error('Failed to parse crop comparison response as JSON:', resultText);
      return res.status(500).json({ success: false, message: 'Invalid response from AI' });
    }

    return res.status(200).json({
      success: true,
      data: parsedResult,
      userId
    });
  } catch (error) {
    console.error('Crop Comparison Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Comparison failed' });
  }
};
