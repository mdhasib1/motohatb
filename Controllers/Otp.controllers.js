const axios = require('axios');
async function sendOtp(otp, phone) {
  try {
    const smsOptions = {
        method: 'POST',
        url: 'https://api.sms.net.bd/sendsms',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: new URLSearchParams({
          api_key: 'ceqMG502Knpa605Z41CW7KJooe6UM0HPWjhPXR42',
          msg: `Dear Motohat User,Phone ${phone} Your One-Time Password (OTP) for login is: ${otp}. Please use this secure code to verify your identity and access your Motohat account. Do not share this OTP with anyone for security reasons.Thank you for choosing Motohat!Best Regards,The Motohat Team`,
          to: `+88${phone}`,
        }),
      };

    await axios(smsOptions);

    return otp;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send SMS');
  }
}


module.exports = sendOtp;
