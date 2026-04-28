import { GoogleGenerativeAI } from '@google/generative-ai';
import ChatHistory from '../models/ChatHistory.js';
import jwt from 'jsonwebtoken';

export const generateAIResponse = async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('API Key missing in environment variables');
      return res.status(500).json({ success: false, message: 'Gemini API key not configured' });
    }

    // Extract user ID if token is provided
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
    // Use gemini-2.5-flash as it's the model we used successfully previously
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const languageMap = {
      en: 'English',
      hi: 'Hindi',
      mr: 'Marathi',
      kn: 'Kannada'
    };
    
    const selectedLang = languageMap[language] || 'English';

    // Farmer-friendly prompt
    const prompt = `You are an AI agricultural assistant named "KrushiMitra". 
You provide helpful, accurate, and easy-to-understand advice to farmers.
Keep your answers concise, practical, and farmer-friendly.
DO NOT use overly technical jargon unless you explain it simply.
Always respond completely in the ${selectedLang} language.

User's message: "${message}"`;

    let resultText = '';
    
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      resultText = response.text();
    } catch (apiError) {
      console.error('Gemini API Error:', apiError);
      // Safe fallback response
      resultText = language === 'en' 
        ? "I'm sorry, I'm having trouble connecting to my agricultural database right now. Please try again later."
        : language === 'hi' ? "मुझे खेद है, मुझे अभी अपने कृषि डेटाबेस से जुड़ने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।"
        : language === 'mr' ? "मला क्षमा करा, सध्या माझ्या कृषी डेटाबेसशी कनेक्ट होण्यात मला अडचण येत आहे. कृपया नंतर पुन्हा प्रयत्न करा."
        : "ನನ್ನ ಕೃಷಿ ಡೇಟಾಬೇಸ್‌ಗೆ ಸಂಪರ್ಕಿಸಲು ನನಗೆ ತೊಂದರೆಯಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."; // kn fallback
    }

    // Save to database
    const chatEntry = new ChatHistory({
      userId,
      userMessage: message,
      botResponse: resultText,
      language: language
    });

    await chatEntry.save();

    res.status(200).json({
      success: true,
      data: {
        message: resultText,
        language: language
      }
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while generating a response. Please try again.' 
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_fallback';
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.userId;

    const history = await ChatHistory.find({ userId })
      .sort({ createdAt: 1 }) // Chronological order
      .limit(50);

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Fetch Chat History Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
};
