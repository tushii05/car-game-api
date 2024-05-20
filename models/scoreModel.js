

const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    guestId: { type: String, required: true },
    score: { type: Number, required: true }
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
