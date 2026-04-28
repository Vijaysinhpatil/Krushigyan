import ReviewPost from '../models/ReviewPost.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import jwt from 'jsonwebtoken';

const getUserInfo = (req) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return { userId: null, userName: 'Anonymous Farmer' };
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_fallback');
    // We assume decoded token has userId and possibly name. 
    // If name is not in token, we just fallback.
    return { userId: decoded.userId, userName: decoded.name || 'Farmer' };
  } catch (e) {
    return { userId: null, userName: 'Anonymous Farmer' };
  }
};

export const createPost = async (req, res) => {
  try {
    const { description, language = 'en' } = req.body;
    const file = req.file;

    if (!description || !file) {
      return res.status(400).json({ success: false, message: 'Description and image are required.' });
    }

    const { userId, userName } = getUserInfo(req);
    const imagePath = `/uploads/${file.filename}`;

    const newPost = new ReviewPost({
      userId,
      userName,
      imagePath,
      description,
      language,
      suggestions: []
    });

    // Generate AI Suggestion
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const prompt = `You are an expert agronomist. Look at this problem described by a farmer in the language '${language}':
"${description}"
Provide exactly one short, practical suggestion (2-3 sentences) to help them solve this. Reply ONLY in the language '${language}'.`;

        const result = await model.generateContent(prompt);
        const aiText = result.response.text();
        
        newPost.suggestions.push({
          userName: 'AgriBot AI',
          text: aiText,
          isAI: true
        });
      } catch (aiError) {
        console.error('Failed to generate AI suggestion for post:', aiError);
      }
    }

    await newPost.save();
    
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.error('Create Review Post Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create post.' });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await ReviewPost.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error('Fetch Review Posts Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts.' });
  }
};

export const addSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, message: 'Suggestion text is required.' });
    }

    const { userId, userName } = getUserInfo(req);
    
    const post = await ReviewPost.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    post.suggestions.push({
      userId,
      userName,
      text,
      isAI: false
    });

    await post.save();
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error('Add Suggestion Error:', error);
    res.status(500).json({ success: false, message: 'Failed to add suggestion.' });
  }
};

export const markHelpful = async (req, res) => {
  try {
    const { id, suggestionId } = req.params;
    
    const post = await ReviewPost.findById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    const suggestion = post.suggestions.id(suggestionId);
    if (!suggestion) return res.status(404).json({ success: false, message: 'Suggestion not found.' });

    suggestion.helpfulCount += 1;
    await post.save();
    
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error('Mark Helpful Error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark helpful.' });
  }
};

export const markBest = async (req, res) => {
  try {
    const { id, suggestionId } = req.params;
    const { userId } = getUserInfo(req);
    
    const post = await ReviewPost.findById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    // Assuming we want to strictly check ownership if we have auth. 
    // For a hackathon where user might be anonymous, we might relax it, but let's check if post.userId exists.
    if (post.userId && userId && post.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Only post owner can mark best.' });
    }

    post.suggestions.forEach(s => {
      s.isBest = (s._id.toString() === suggestionId);
    });

    await post.save();
    
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error('Mark Best Error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark best.' });
  }
};
