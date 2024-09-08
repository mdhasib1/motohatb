const nodemailer = require('nodemailer');
const sendOtp = require('../services/otpService');

const sendEmail = async (subject, html, to) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtp, sendEmail };
