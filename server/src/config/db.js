import mongoose from 'mongoose';

export const connectDB = async () => {
  // process.env.MONGO_URI || 
  // 'mongodb://localhost:27017/farmer-market'
  const uri = process.env.MONGO_URI;

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}, DB: ${conn.connection.name}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
