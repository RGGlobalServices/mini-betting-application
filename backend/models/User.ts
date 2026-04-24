import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true,
    default: 100
  }
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
