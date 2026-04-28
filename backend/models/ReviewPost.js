import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, required: true },
  text: { type: String, required: true },
  isAI: { type: Boolean, default: false },
  helpfulCount: { type: Number, default: 0 },
  isBest: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const reviewPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, required: true, default: 'Anonymous Farmer' },
  imagePath: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, default: 'en', enum: ['en', 'hi', 'mr', 'kn'] },
  suggestions: [suggestionSchema],
  createdAt: { type: Date, default: Date.now }
});

const ReviewPost = mongoose.model('ReviewPost', reviewPostSchema);
export default ReviewPost;
