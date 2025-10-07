// Email service using Nodemailer for sending OTP and notifications
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Create reusable transporter for sending emails
 * Configured using environment variables
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Sends OTP email to user for authentication
 * @param email - Recipient email address
 * @param otp - 6-digit OTP code
 * @returns Promise<boolean> - true if email sent successfully
 */
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Ticket Dashboard" <noreply@ticketdashboard.com>',
      to: email,
      subject: 'Your Login OTP - Ticket Dashboard',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Welcome to Ticket Dashboard!</h2>
          <p style="color: #666; font-size: 16px;">Your One-Time Password (OTP) for login is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #4F46E5; letter-spacing: 8px; margin: 0; font-size: 36px;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this OTP, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Ticket Dashboard - Your Project Management Solution</p>
        </div>
      `,
      text: `Your OTP for Ticket Dashboard login is: ${otp}. This OTP will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return false;
  }
};

/**
 * Sends notification email for ticket activities
 * @param email - Recipient email address
 * @param subject - Email subject
 * @param message - Email content
 * @returns Promise<boolean> - true if email sent successfully
 */
export const sendNotificationEmail = async (
  email: string,
  subject: string,
  message: string
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Ticket Dashboard" <noreply@ticketdashboard.com>',
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Ticket Dashboard Notification</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-left: 4px solid #4F46E5; margin: 20px 0;">
            <p style="color: #666; font-size: 16px; margin: 0;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Ticket Dashboard - Your Project Management Solution</p>
        </div>
      `,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Notification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending notification email:', error);
    return false;
  }
};

