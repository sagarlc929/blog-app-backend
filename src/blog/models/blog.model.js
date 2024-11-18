import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
});

export default mongoose.model('blog', blogSchema);
