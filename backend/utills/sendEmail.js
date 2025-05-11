const nodemailer = require('nodemailer');

// Use test account directly (no env vars needed for Ethereal)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '079bei048@ioepc.edu.np', // Your real Gmail
      pass: 'fjgy isnc mnzl degd' // NOT your regular password!
    }
  });

async function sendEmail(userEmail, verificationToken, isverifyEmail) {
    let title = 'Verify your email address:';
    let body = 'Verification Code'
    if(!isverifyEmail){
       title = 'Reset Password:';
        body = 'Reset Link'
    }

    try {
        const info = await transporter.sendMail({
            // Use the same email as auth user
            from: '"Expense Tracker" <maddison53@ethereal.email>',
            to: userEmail,
            subject: `${title}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Expense Tracker</h2>
                <p>${title}</p>
                <div style="display: inline-block; padding: 10px 20px; background-color: #2563eb; 
                          color: white; text-decoration: none; border-radius: 5px;">
                     ${ body }
                  ${verificationToken}
                </div>
                <p style="margin-top: 20px; color: #6b7280;">
                  This code will expire in 1 hour. If you didn't request this, please ignore this email.
                </p>
              </div>
            `,
        });

        // Add Ethereal-specific debug output
        console.log("Email successfully sent. Preview URL:", nodemailer.getTestMessageUrl(info));
        return true;
    } catch (error) {
        console.error("Email sending failed:", {
            error: error.message,
            stack: error.stack
        });
        return false;
    }
}

module.exports = sendEmail;