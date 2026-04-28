import mongoose from 'mongoose';
import dns from 'dns';
import http from 'http';

// Use Google DNS to prevent SRV lookup failures
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Helper to get public IP
const getPublicIP = () => {
  return new Promise((resolve) => {
    http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
      resp.on('data', function(ip) {
        resolve(ip.toString());
      });
    }).on('error', () => resolve('Could not detect IP'));
  });
};

const connectDB = async (retryCount = 3) => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error('Error: MONGO_URI is missing in .env file');
    process.exit(1);
  }

  // Most aggressive connection options for Atlas
  const options = {
    serverSelectionTimeoutMS: 10000, // Increase to 10s
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    family: 4, // Force IPv4
    retryWrites: true,
  };

  const publicIP = await getPublicIP();

  while (retryCount > 0) {
    try {
      console.log(`Connecting to MongoDB Atlas... (Retries left: ${retryCount})`);
      console.log(`Diagnostic IP: ${publicIP}`);
      
      await mongoose.connect(mongoURI, options);
      
      console.log('------------------------------------');
      console.log('✅ MongoDB Connected Successfully!');
      console.log('------------------------------------');
      return;
    } catch (error) {
      retryCount--;
      console.error(`❌ Connection failed: ${error.message}`);
      
      if (retryCount === 0) {
        console.error('\n================================================');
        console.error('🔥 FATAL ERROR: DATABASE CONNECTION FAILED 🔥');
        console.error('================================================');
        console.error(`1. Your IP "${publicIP}" is NOT allowed by Atlas.`);
        console.error(`2. SOLUTION: Add "0.0.0.0/0" to Atlas Network Access.`);
        console.error(`3. URL: https://cloud.mongodb.com/`);
        console.error('================================================\n');
        process.exit(1);
      }
      
      console.log('Retrying in 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
};

export default connectDB;
