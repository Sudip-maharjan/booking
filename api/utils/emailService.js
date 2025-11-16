import nodemailer from "nodemailer";
import crypto from "crypto";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const generateVerificationToken = () => {
  const rand = crypto.randomBytes(32).toString("hex");
  console.log(rand);
  return rand;
};

export const sendVerificationEmail = async (email, username, token) => {
  const transporter = createTransporter();

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"${process.env.APP_NAME || "Hotel Booking"}" <${
      process.env.EMAIL_USER
    }>`,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #003580;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #003580;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${process.env.APP_NAME || "Hotel Booking"}!</h1>
            </div>
            <div class="content">
              <h2>Hi ${username},</h2>
              <p>Thank you for registering with us. To complete your registration and verify your email address, please click the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #003580;">${verificationUrl}</p>
              
              <p><strong>This link will expire in 24 hours.</strong></p>
              
              <p>If you didn't create an account with us, please ignore this email.</p>
              
              <p>Best regards,<br>The ${
                process.env.APP_NAME || "Hotel Booking"
              } Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (email, username) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${process.env.APP_NAME || "Hotel Booking"}" <${
      process.env.EMAIL_USER
    }>`,
    to: email,
    subject: "Welcome! Your Account is Verified",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #28a745;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Email Verified!</h1>
            </div>
            <div class="content">
              <h2>Welcome aboard, ${username}!</h2>
              <p>Your email has been successfully verified. You can now enjoy all features of our platform:</p>
              
              <ul>
                <li>Browse and book hotels worldwide</li>
                <li>Manage your bookings</li>
                <li>Save your favorite properties</li>
                <li>Get exclusive deals and offers</li>
              </ul>
              
              <p>Start exploring amazing hotels and make your next booking!</p>
              
              <p>Best regards,<br>The ${
                process.env.APP_NAME || "Hotel Booking"
              } Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Don't throw error for welcome email - it's not critical
    return false;
  }
};
