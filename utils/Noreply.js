const nodemailer = require("nodemailer");
const env = require('dotenv');

env.config()

const sendEmail = async (subject, customizedMessage, send_to, sent_from, reply_to=null,emailHeader) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER_NOREPLY,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const options = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: customizedMessage,
    headers: {
      'X-Mailer': 'MotoHat Mailer',
      'X-Domain': 'motohat.com',
      'Precedence': 'bulk',
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'High',
      'List-Unsubscribe': '<mailto:unsubscribe@motohat.com>',
    },
  };

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info.response);
    }
  });
};

module.exports = sendEmail;
