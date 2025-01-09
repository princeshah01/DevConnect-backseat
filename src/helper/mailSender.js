const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.PASSWORD_SENDER 

  }
});

async function sendResetEmail(toEmail, resetLink) {
    try {
      const info = await transporter.sendMail({
        from: '"SoulMate Support" <soulmate.rjb@gmail.com>', 
        to: toEmail, 
        subject: "Password Reset Request from SoulMate", 
        text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`, 
        html: `
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetLink}" target="_blank">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        `, 
      });
  
      console.log(`Reset email sent: ${info.messageId}`);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  module.exports = sendResetEmail ;