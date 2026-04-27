import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import CropAnalysis from '../models/CropAnalysis.js';
import SoilAnalysis from '../models/SoilAnalysis.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password, location, cropType } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      location,
      cropType
    });
    
    await user.save();

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Internal server error during signup' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_fallback';
    const payload = { userId: user._id };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'default_secret_fallback';
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [cropAnalysisCount, soilAnalysisCount] = await Promise.all([
      CropAnalysis.countDocuments({ userId: user._id }),
      SoilAnalysis.countDocuments({ userId: user._id })
    ]);

    res.status(200).json({
      user,
      stats: {
        cropAnalysisCount,
        soilAnalysisCount,
        totalAnalysisCount: cropAnalysisCount + soilAnalysisCount
      }
    });
  } catch (error) {
    console.error('Get Current User Error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
