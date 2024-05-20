const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const GuestPlayer = require('../models/guestPlayer'); 


router.get('/common-highest-score', async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};

    if (start && end) {
      filter.timestamp = { $gte: new Date(start), $lte: new Date(end) };
    }

    const maxUserScore = await User.find(filter).sort({ score: -1 }).limit(1);
    const maxGuestPlayerScore = await GuestPlayer.find(filter).sort({ score: -1 }).limit(1);

    let commonHighestScore = null;
    if (maxUserScore && maxGuestPlayerScore) {
      commonHighestScore = maxUserScore.score > maxGuestPlayerScore.score ? maxUserScore : maxGuestPlayerScore;
    } else if (maxUserScore) {
      commonHighestScore = maxUserScore;
    } else if (maxGuestPlayerScore) {
      commonHighestScore = maxGuestPlayerScore;
    }

    res.json({ commonHighestScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;




