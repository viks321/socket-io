import mongoose from 'mongoose';

const connectDB = async () => {//mongodb://localhost:27017/testDB
  try {
    
    await mongoose.connect('mongodb+srv://vikashraval995:S7Rm9ZXMvvqpUBMY@chatmessagedb.z4twiua.mongodb.net/messageDB?retryWrites=true&w=majority');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;