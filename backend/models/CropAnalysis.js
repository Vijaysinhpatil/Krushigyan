import mongoose from 'mongoose';

const cropAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  imageUrl: {
    type: String,
    required: true
  },
  detectedDisease: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  precautions: {
    type: String,
  },
  treatmentSteps: {
    type: String,
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

const CropAnalysis = mongoose.model('CropAnalysis', cropAnalysisSchema);
export default CropAnalysis;
