import fs from 'fs';
import jwt from 'jsonwebtoken';
import { GoogleGenerativeAI } from '@google/generative-ai';
import SoilAnalysis from '../models/SoilAnalysis.js';

export const analyzeSoil = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const { organicCarbon = '', soilTexture = '', moisture = '', language = 'en' } = req.body;
    
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
    // Note: The user's API key returned 404 for gemini-1.5-flash previously, so we use gemini-2.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

    const prompt = `Analyze this soil image and provided soil parameters:
- Organic Carbon: ${organicCarbon}%
- Soil Texture: ${soilTexture}
- Moisture: ${moisture}%

Give:
1. Soil health summary
2. Estimated pH level
3. Nitrogen, Phosphorus, Potassium levels
4. Simple recommendations for farmers

IMPORTANT:
- Keep language simple and easy
- Avoid technical jargon
- Respond in ${selectedLang} language
- Output must be structured JSON EXACTLY as follows:
{
  "soilHealth": "...",
  "phLevel": "...",
  "nutrients": {
    "nitrogen": "...",
    "phosphorus": "...",
    "potassium": "..."
  },
  "recommendations": ["...", "..."]
}
Ensure the response is ONLY valid JSON and not wrapped in markdown code blocks.`;

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
      return res.status(500).json({ success: false, message: 'Analysis failed. Please try again.' });
    }

    const newAnalysis = new SoilAnalysis({
      userId,
      imageUrl: req.file.path,
      organicCarbon,
      soilTexture,
      moisture,
      result: parsedResult,
      language
    });

    await newAnalysis.save();

    res.status(200).json({
      success: true,
      data: parsedResult
    });
  } catch (error) {
    console.error('Soil Analysis Error:', error);
    res.status(500).json({ success: false, message: 'Analysis failed. Please try again.' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await SoilAnalysis.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error('Soil History Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
};
