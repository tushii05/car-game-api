const nodemailer = require('nodemailer');
require('dotenv').config();
var transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, 
  secure: true, 
  auth: {
    user: 'kashish07sonare@gmail.com', 
    pass: 'rvww oeiv dcnd rqsm' 
  }
});
module.exports = transport;   