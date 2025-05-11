const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER_EMAIL,
    pass: process.env.NODEMAILER_USER_PASS_KEY,
  },
});

const sendEmail = async (userEmail, verificationToken, isSignUp) => {
  const title = isSignUp
    ? 'Verify Your Email Address.'
    : 'Reset Password verfication email';
  const body = 'Verify your Email through this link';

  try {
    await transporter.sendMail({
    from: 'Social Media App <' + process.env.NODEMAILER_USER_EMAIL + '>',
    to: userEmail,
    subject: title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Social Media App</h2>
        <p>${title}</p>
        <div style="display: inline-block; padding: 10px 20px;
                      color: white; background-color: #2563eb; text-decoration: none; border-radius: 5px;">
          ${body}: ${verificationToken}
        </div>
        <p style="margin-top: 20px; color: #6b7280;">
          This code will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  });
  console.log('Email is succeessfully sent.');
  return true;
  } catch (error) {
    console.error("Error in sending mail.");
    return false;
  }
   
};

module.exports = sendEmail;
