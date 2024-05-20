
const admin = require('firebase-admin');
const User = require('../models/guestPlayer');
const serviceAccount = require('../firebase/google-services.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (token, playerName) => {
  const message = {
    notification: {
      title: 'Welcome!',
      body: `Welcome ${playerName} as a guest player!`,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('FCM response:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

const guestId = async (req, res) => {
  try {
    const guestId = generateGuestId(req.body.playerName);
    const score = req.body.score || 0;

    const user = new User({
      playerName: req.body.playerName,
      score: score,
      guestId: guestId,
    });

    const savedUser = await user.save();

    await sendNotification(guestId, req.body.playerName);

    res.status(201).json({ message: 'Guest player created successfully', user: savedUser, notification: 'Notified' });
  } catch (error) {
    console.error('Error creating guest player:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const generateGuestId = (playerName) => {
  const timestamp = Date.now().toString();
  const uniqueId = playerName.replace(/\s/g, '') + timestamp;
  return uniqueId;
};

const editGuestId = async (req, res) => {
  const { guestId, newGuestId } = req.body;
  try {
    const existingGuest = await User.findOne({ guestId: newGuestId });
    if (existingGuest) {
      return res.status(400).json({ error: 'New guest ID already exists. Please choose a different one.' });
    }

    const guestToUpdate = await User.findOne({ guestId });
    if (!guestToUpdate) {
      return res.status(404).json({ error: 'Guest ID not found.' });
    }

    guestToUpdate.guestId = newGuestId;
    await guestToUpdate.save();

    res.json({ guestId: guestToUpdate.guestId, message: 'Guest ID updated successfully.' });
  } catch (err) {
    console.error('Error updating guest ID:', err);
    res.status(500).json({ error: 'Failed to update guest ID. Please try again later.' });
  }
};

const usersguestid = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteByGuestId = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const deletedUser = await User.findOneAndDelete({ guestId: id });
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const postScore = async (req, res) => {
  try {
    const { guestId, score } = req.body;

    if (!guestId || !score) {
      return res.status(400).json({ error: 'Guest ID and score are required' });
    }

    const newScore = new Score({
      guestId,
      score,
    });

    await newScore.save();

    res.status(201).json({ message: 'Score posted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  guestId,
  editGuestId,
  usersguestid,
  deleteByGuestId,
  postScore,
};



