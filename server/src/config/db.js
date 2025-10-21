import mongoose from 'mongoose';

export const connectDB=async()=>{
    const uri=process.env.MONGO_URI;
    if(!uri)throw new error("MONGO_URI missing");
    try{
        const connect = await mongoose.connect(uri || 'mongodb://localhost:27017/farmer-market');
        console.log(`MongoDB connected: ${connect.connection.host},${connect.connection.name}`);

    }catch(err){
        console.error('MongoDB connection error',err.message);
        process.exit(1);

    };
}