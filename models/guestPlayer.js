const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  playerName: String,
  guestId: String,
  score: {
    type: Number,
    
    required: true,
  },
  timestamp: { type: Date, default: Date.now } 
 
});

const guestplayer = mongoose.model('guestplayer', userSchema);

module.exports = guestplayer;




