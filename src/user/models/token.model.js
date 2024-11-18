// models/refreshToken.model.js
import mongoose from 'mongoose'
const TokenSchema = new mongoose.Schema({
  accessToken: { type:String },
  refreshToken: { type:String },
  user:{
    type: mongoose.Types.ObjectId,
    ref: "user"
  },
  createdAt: {type: Date, default: Date.now}
});

export default mongoose.model('Token', TokenSchema);
