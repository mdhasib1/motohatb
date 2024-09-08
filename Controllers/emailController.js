const fs = require('fs');
const path = require('path');


async function sendEmailWithTemplate(to, subject, templateFileName, templateData) {
  try {
    const templatePath = path.join(__dirname, 'email_templates', templateFileName);
    const template = fs.readFileSync(templatePath, 'utf-8');

    const compiledTemplate = template.replace(/\{\{(.+?)\}\}/g, (match, p1) => {
      return templateData[p1.trim()];
    });

    const mailOptions = {
      from: 'your@example.com',
      to,
      subject,
      html: compiledTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = {
  sendEmailWithTemplate,
};
