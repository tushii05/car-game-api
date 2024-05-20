const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  playerName: String,
  verificationToken: String,
  guestId: String,
  score : Number,
  
  
  isVerified: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now } 
}, );

const User = mongoose.model('User', userSchema);

module.exports = User;



