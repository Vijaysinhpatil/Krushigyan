import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous chats or change if auth is strictly required
  },
  userMessage: {
    type: String,
    required: true
  },
  botResponse: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'mr', 'kn'],
    default: 'en'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;
