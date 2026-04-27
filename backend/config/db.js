import mongoose from 'mongoose';
import dns from 'dns';

// Use Google DNS to prevent SRV lookup failures
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('Error: MONGO_URI is missing in .env file');
      process.exit(1);
    }
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // App should not crash silently, exit process with failure
  }
};

export default connectDB;
