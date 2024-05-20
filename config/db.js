const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/car_Racing_database', {
     // useNewUrlParser: true,
     // useUnifiedTopology: true,
      //useCreateIndex: true,
      //useFindAndModify: false,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};


module.exports = connectDB;
