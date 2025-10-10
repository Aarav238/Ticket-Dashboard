// Email service using SendGrid for sending OTP and notifications
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialize SendGrid client with API key
 * API key should be set in SENDGRID_API_KEY environment variable
 */
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

/**
 * Default sender email address
 * Must be a verified sender in SendGrid
 */
const DEFAULT_FROM = process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com';

/**
 * Sends OTP email to user for authentication
 * @param email - Recipient email address
 * @param otp - 6-digit OTP code
 * @returns Promise<boolean> - true if email sent successfully
 */
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    const msg = {
      to: email,
      from: DEFAULT_FROM,
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

    await sgMail.send(msg);
    console.log(`✅ OTP email sent to ${email}`);
    return true;
  } catch (error: any) {
    console.error('❌ Error sending OTP email:', error);
    if (error.response) {
      console.error('SendGrid Error Details:', error.response.body);
    }
    return false;
  }
};

/**
 * Rich notification data for emails
 */
export interface RichNotificationData {
  type: string;
  title: string;
  description: string;
  actionBy?: string; // User who performed the action
  projectName?: string;
  ticketTitle?: string;
  ticketStatus?: string;
  ticketPriority?: string;
  ticketType?: string;
  assignedTo?: string;
  additionalDetails?: string;
  actionUrl?: string; // Link to view the item
}

/**
 * Sends notification email for ticket activities (legacy - simple version)
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
    const msg = {
      to: email,
      from: DEFAULT_FROM,
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

    await sgMail.send(msg);
    console.log(`✅ Notification email sent to ${email}`);
    return true;
  } catch (error: any) {
    console.error('❌ Error sending notification email:', error);
    if (error.response) {
      console.error('SendGrid Error Details:', error.response.body);
    }
    return false;
  }
};

/**
 * Sends rich notification email with detailed information
 * @param email - Recipient email address
 * @param data - Rich notification data
 * @returns Promise<boolean> - true if email sent successfully
 */
export const sendRichNotificationEmail = async (
  email: string,
  data: RichNotificationData
): Promise<boolean> => {
  try {
    // Determine color based on notification type
    const typeColors: Record<string, string> = {
      TICKET_CREATED: '#10B981', // Green
      TICKET_UPDATED: '#3B82F6', // Blue
      TICKET_MOVED: '#8B5CF6', // Purple
      TICKET_DELETED: '#EF4444', // Red
      PROJECT_CREATED: '#10B981', // Green
      PROJECT_UPDATED: '#F59E0B', // Orange
      PROJECT_DELETED: '#EF4444', // Red
    };

    const priorityColors: Record<string, string> = {
      LOW: '#6B7280',
      MEDIUM: '#F59E0B',
      HIGH: '#EF4444',
      URGENT: '#DC2626',
    };

    const statusColors: Record<string, string> = {
      TODO: '#6B7280',
      IN_PROGRESS: '#3B82F6',
      DONE: '#10B981',
    };

    const color = typeColors[data.type] || '#4F46E5';
    const priorityColor = data.ticketPriority ? priorityColors[data.ticketPriority] || '#6B7280' : null;
    const statusColor = data.ticketStatus ? statusColors[data.ticketStatus] || '#6B7280' : null;

    const msg = {
      to: email,
      from: DEFAULT_FROM,
      subject: `Ticket Dashboard - ${data.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%); padding: 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">${data.title}</h1>
                      <p style="margin: 10px 0 0 0; color: #ffffffdd; font-size: 14px;">${data.type.replace(/_/g, ' ')}</p>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 30px;">
                      
                      <!-- Description -->
                      <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border-left: 4px solid ${color}; margin-bottom: 25px;">
                        <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">${data.description}</p>
                      </div>

                      <!-- Details Grid -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        ${data.actionBy ? `
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6B7280; font-size: 14px; font-weight: 500;">Action By:</span>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <span style="color: #111827; font-size: 14px; font-weight: 600;">${data.actionBy}</span>
                          </td>
                        </tr>
                        ` : ''}
                        
                        ${data.projectName ? `
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6B7280; font-size: 14px; font-weight: 500;">Project:</span>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <span style="color: #111827; font-size: 14px; font-weight: 600;">${data.projectName}</span>
                          </td>
                        </tr>
                        ` : ''}

                        ${data.ticketTitle ? `
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6B7280; font-size: 14px; font-weight: 500;">Ticket:</span>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <span style="color: #111827; font-size: 14px; font-weight: 600;">${data.ticketTitle}</span>
                          </td>
                        </tr>
                        ` : ''}

                        ${data.ticketStatus ? `
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6B7280; font-size: 14px; font-weight: 500;">Status:</span>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <span style="display: inline-block; padding: 4px 12px; background-color: ${statusColor}22; color: ${statusColor}; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${data.ticketStatus.replace(/_/g, ' ')}</span>
                          </td>
                        </tr>
                        ` : ''}

                        ${data.ticketPriority ? `
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6B7280; font-size: 14px; font-weight: 500;">Priority:</span>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <span style="display: inline-block; padding: 4px 12px; background-color: ${priorityColor}22; color: ${priorityColor}; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${data.ticketPriority}</span>
                          </td>
                        </tr>
                        ` : ''}

                        ${data.ticketType ? `
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6B7280; font-size: 14px; font-weight: 500;">Type:</span>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <span style="color: #111827; font-size: 14px;">${data.ticketType}</span>
                          </td>
                        </tr>
                        ` : ''}

                        ${data.assignedTo ? `
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6B7280; font-size: 14px; font-weight: 500;">Assigned To:</span>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                            <span style="color: #111827; font-size: 14px; font-weight: 600;">${data.assignedTo}</span>
                          </td>
                        </tr>
                        ` : ''}
                      </table>

                      ${data.additionalDetails ? `
                      <div style="margin-top: 20px; padding: 15px; background-color: #FEF3C7; border-radius: 6px; border-left: 4px solid #F59E0B;">
                        <p style="margin: 0; color: #92400E; font-size: 14px; line-height: 1.5;">${data.additionalDetails}</p>
                      </div>
                      ` : ''}

                      ${data.actionUrl ? `
                      <div style="margin-top: 30px; text-align: center;">
                        <a href="${data.actionUrl}" style="display: inline-block; padding: 12px 30px; background-color: ${color}; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">View Details</a>
                      </div>
                      ` : ''}

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #6B7280; font-size: 12px;">
                        Ticket Dashboard - Your Project Management Solution
                      </p>
                      <p style="margin: 10px 0 0 0; color: #9CA3AF; font-size: 11px;">
                        This is an automated notification. Please do not reply to this email.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
${data.title}
${data.type.replace(/_/g, ' ')}

${data.description}

${data.actionBy ? `Action By: ${data.actionBy}` : ''}
${data.projectName ? `Project: ${data.projectName}` : ''}
${data.ticketTitle ? `Ticket: ${data.ticketTitle}` : ''}
${data.ticketStatus ? `Status: ${data.ticketStatus}` : ''}
${data.ticketPriority ? `Priority: ${data.ticketPriority}` : ''}
${data.ticketType ? `Type: ${data.ticketType}` : ''}
${data.assignedTo ? `Assigned To: ${data.assignedTo}` : ''}
${data.additionalDetails ? `\n${data.additionalDetails}` : ''}
${data.actionUrl ? `\nView Details: ${data.actionUrl}` : ''}

---
Ticket Dashboard - Your Project Management Solution
      `.trim(),
    };

    await sgMail.send(msg);
    console.log(`✅ Rich notification email sent to ${email}`);
    return true;
  } catch (error: any) {
    console.error('❌ Error sending rich notification email:', error);
    if (error.response) {
      console.error('SendGrid Error Details:', error.response.body);
    }
    return false;
  }
};

