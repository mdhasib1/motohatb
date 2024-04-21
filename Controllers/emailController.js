const fs = require('fs');
const path = require('path');


async function sendEmailWithTemplate(to, subject, templateFileName, templateData) {
  try {
    // Read email template file
    const templatePath = path.join(__dirname, 'email_templates', templateFileName);
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Compile email template with provided data
    const compiledTemplate = template.replace(/\{\{(.+?)\}\}/g, (match, p1) => {
      return templateData[p1.trim()];
    });

    // Send email
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

// Export function for use in other modules
module.exports = {
  sendEmailWithTemplate,
};
