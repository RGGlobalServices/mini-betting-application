import mongoose from 'mongoose';

export const connectDB = async () => {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('MongoDB connection error. Falling back to in-memory mode.', err);
    }
  } else {
    console.log('No MONGODB_URI found. Running backend with in-memory fallback state.');
  }
};
