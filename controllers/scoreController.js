const Score = require('../models/scoreModel');

const saveScore = async (req, res) => {
    const { guestId, score } = req.body;
    try {
        const existingScore = await Score.findOne({ guestId });
        if (existingScore) {
            if (score > existingScore.score) {
                existingScore.score = score;
                await existingScore.save();
                res.json({ guestId, score, message: 'Highest score updated successfully.' });
            } else {
                res.json({ guestId, score, message: 'Score not higher than existing highest score.' });
            }
        } else {
            const newScore = new Score({ guestId, score });
            await newScore.save();
            res.json({ guestId, score, message: 'Score saved successfully.' });
        }
    } catch (err) {
        console.error('Error saving score:', err);
        res.status(500).json({ error: 'Failed to save score. Please try again later.' });
    }
};

module.exports = { saveScore };
