import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  message: String,
  from: String,
  to: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);

