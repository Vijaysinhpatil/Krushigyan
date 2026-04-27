import mongoose from 'mongoose';

const soilAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  imageUrl: {
    type: String,
    required: true
  },
  organicCarbon: {
    type: String,
  },
  soilTexture: {
    type: String,
  },
  moisture: {
    type: String,
  },
  result: {
    soilHealth: String,
    phLevel: String,
    nutrients: {
      nitrogen: String,
      phosphorus: String,
      potassium: String
    },
    recommendations: [String]
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

const SoilAnalysis = mongoose.model('SoilAnalysis', soilAnalysisSchema);
export default SoilAnalysis;
