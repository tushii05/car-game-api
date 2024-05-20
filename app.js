const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/userRoutes');
const guestRouter = require('./routes/guestRoutes');
const apiRoutess = require('./routes/apiRoutes');
const axios = require('axios'); // Import axios here
const firebase = require('./firebase/google-services.json');
const cors = require('cors');

require('dotenv').config();

connectDB();

const app = express();
app.use(cors())

app.use(bodyParser.json());

app.use('/api', apiRoutess);
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/guest', guestRouter);

app.set('view engine', 'ejs');

app.get('/dashboard', async (req, res) => {
  try {
    const usersResponse = await axios.get('http://localhost:5000/api/auth/users');
    const usersData = usersResponse.data;

    const rankingsResponse = await axios.get('http://localhost:5000/api/guest/usersguestid');
    const rankingsData = rankingsResponse.data;

    const highestScoresResponse = await axios.get('http://localhost:5000/api/common-highest-score');
    const highestScoresData = highestScoresResponse.data.commonHighestScore;
    res.render('dashboard', {
      totalUsersCount: usersData.length,
      users: usersData,
      rankings: rankingsData,
      highestScores: highestScoresData
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});