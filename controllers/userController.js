const crypto = require('crypto');
const transporter = require('../config/mailer'); 
const User = require('../models/User');

const generateToken = async () => {
  const token = crypto.randomBytes(20).toString('hex'); 
  return token;
};

const generateGuestId = async () => {
  let isUnique = false;
  let guestId;

  while (!isUnique) {
    guestId = crypto.randomBytes(10).toString('hex'); 
    const existingUser = await User.findOne({ guestId }); 

    if (!existingUser) {
      isUnique = true; 
    }
  }

  return guestId;
};

const register = async (req, res) => {
  const { email, checkboxValue } = req.body; 

  try {
    const existingUser = await User.findOne({ email });
    if (!checkboxValue) {
      return res.status(400).json({ message: 'Please accept the terms and conditions.' });
    } else if (existingUser) {
      return res.status(409).json({ message: 'User already exists', email });
    }

    const token = await generateToken();
    const guestId = await generateGuestId();

    const newUser = new User({
      email: email,
      verificationToken: token,
      guestId: guestId,
      score: 0, 
      isVerified: false,
      timestamp: new Date().toISOString(), 
    });
    await newUser.save();

    const verificationLink = `${process.env.CLIENT_URL}/verify?token=${token}&email=${email}`;
    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: 'Verify Your Email',
      html: `<h1>Welcome to Traffic Mania!🚗</h1><p>💨 Buckle up for a hilarious journey packed with comedy, chaos, and crazy fun! 🎉😄</p>
      <p>Click <a href="${'https://github.com/Abhisek730/racing-moto-game-'}">here</a> to verify your email and continue to our website.</p>`,
    });

    res.status(200).json({
      email: newUser.email,
      verificationToken: newUser.verificationToken,
      guestId: newUser.guestId,
      score: newUser.score,
      isVerified: newUser.isVerified,
      timestamp: newUser.timestamp,
      message: 'Verification link sent to your email',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyEmail = async (req, res) => {
  const { token, email } = req.query;

  const user = await User.findOne({ email, verificationToken: token });

  if (user) {
    const tokenExpirationTime = user.createdAt.getTime() + 3600000;
    if (Date.now() > tokenExpirationTime) {
      res.status(400).send('Verification link expired.');
    } else {
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
      res.redirect('/success.html');
    }
  } else {
    res.status(404).send('User not found.'); // Handle case where user is not found
  }
};

const deleteUserByGuestId = async (req, res) => {
  const { guestId } = req.body;

  try {
    const deletedUser = await User.findOneAndDelete({ guestId });
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully', email: deletedUser.email });
    } else {
      res.status(409).json({ message: 'User deleted' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const users = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register,
  verifyEmail,
  deleteUserByGuestId,
  users
};

