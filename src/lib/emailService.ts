import emailjs from 'emailjs-com';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  fromName: 'United Future Alliance',
  fromEmail: 'noreply@ufa.org'
};

// Email Templates
export const EMAIL_TEMPLATES = {
  // Event Registration Confirmation
  EVENT_REGISTRATION: {
    id: 'event_registration',
    subject: 'Event Registration Confirmed - {{eventTitle}}',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">United Future Alliance</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Event Registration Confirmed</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hello {{firstName}}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for registering for <strong>{{eventTitle}}</strong>. Your registration has been confirmed and we're excited to have you join us!
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #1f2937; margin-top: 0;">Event Details</h3>
            <p style="margin: 5px 0;"><strong>Event:</strong> {{eventTitle}}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> {{eventDate}}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> {{eventLocation}}</p>
            <p style="margin: 5px 0;"><strong>Confirmation Code:</strong> <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace;">{{confirmationCode}}</span></p>
          </div>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">What's Next?</h3>
            <ul style="color: #4b5563; line-height: 1.6;">
              <li>Save this confirmation code for your records</li>
              <li>You'll receive event reminders closer to the date</li>
              <li>Check your email for any updates or changes</li>
            </ul>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            If you have any questions or need to make changes to your registration, please contact us at 
            <a href="mailto:info@ufa.org" style="color: #10b981;">info@ufa.org</a>.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://ufa.org" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Visit Our Website</a>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
          <p>United Future Alliance | Building a Better Future Together</p>
          <p>This email was sent to {{email}}. If you no longer wish to receive these emails, you can <a href="#" style="color: #10b981;">unsubscribe</a>.</p>
        </div>
      </div>
    `
  },

  // Membership Application Confirmation
  MEMBERSHIP_CONFIRMATION: {
    id: 'membership_confirmation',
    subject: 'Membership Application Received - UFA',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">United Future Alliance</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Membership Application Received</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hello {{firstName}}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for your interest in joining the United Future Alliance! We have received your membership application and are excited about your commitment to building a better future together.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
            <h3 style="color: #1f2937; margin-top: 0;">Application Details</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> {{firstName}} {{lastName}}</p>
            <p style="margin: 5px 0;"><strong>Registration ID:</strong> <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace;">{{registrationId}}</span></p>
            <p style="margin: 5px 0;"><strong>Application Date:</strong> {{applicationDate}}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Pending Review</span></p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">What Happens Next?</h3>
            <ul style="color: #4b5563; line-height: 1.6;">
              <li>Our team will review your application within 2-3 business days</li>
              <li>You'll receive an email notification once your application is processed</li>
              <li>If approved, you'll receive your membership welcome package</li>
            </ul>
          </div>
          
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #065f46; margin-top: 0;">Membership Benefits</h3>
            <ul style="color: #4b5563; line-height: 1.6;">
              <li>Access to exclusive events and workshops</li>
              <li>Networking opportunities with like-minded individuals</li>
              <li>Participation in community development projects</li>
              <li>Regular updates on UFA initiatives and opportunities</li>
            </ul>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            If you have any questions about your application, please contact us at 
            <a href="mailto:membership@ufa.org" style="color: #8b5cf6;">membership@ufa.org</a>.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://ufa.org" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Visit Our Website</a>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
          <p>United Future Alliance | Building a Better Future Together</p>
          <p>This email was sent to {{email}}. If you no longer wish to receive these emails, you can <a href="#" style="color: #8b5cf6;">unsubscribe</a>.</p>
        </div>
      </div>
    `
  },

  // Newsletter Subscription
  NEWSLETTER_WELCOME: {
    id: 'newsletter_welcome',
    subject: 'Welcome to UFA Newsletter!',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">United Future Alliance</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome to Our Newsletter!</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Welcome to the UFA Community!</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for subscribing to our newsletter! You'll now receive regular updates about our initiatives, upcoming events, and opportunities to get involved in building a better future.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #1f2937; margin-top: 0;">What You'll Receive</h3>
            <ul style="color: #4b5563; line-height: 1.6;">
              <li>Weekly updates on UFA activities and initiatives</li>
              <li>Early access to event announcements</li>
              <li>Exclusive content and resources</li>
              <li>Opportunities to volunteer and participate</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://ufa.org" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Explore Our Website</a>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
          <p>United Future Alliance | Building a Better Future Together</p>
          <p>This email was sent to {{email}}. If you no longer wish to receive these emails, you can <a href="#" style="color: #f59e0b;">unsubscribe</a>.</p>
        </div>
      </div>
    `
  },

  // User Welcome Email (for new account signup)
  USER_WELCOME: {
    id: 'user_welcome',
    subject: 'Welcome to United Future Alliance!',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">United Future Alliance</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome to Our Community!</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hello {{firstName}}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Welcome to the United Future Alliance! We're thrilled to have you join our community of changemakers working together to build a better future.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #1f2937; margin-top: 0;">Your Account Details</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> {{firstName}} {{lastName}}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> {{email}}</p>
            <p style="margin: 5px 0;"><strong>Account Created:</strong> {{signupDate}}</p>
          </div>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">What You Can Do Now</h3>
            <ul style="color: #4b5563; line-height: 1.6;">
              <li>📅 <strong>Browse Events:</strong> Discover upcoming community events and register to attend</li>
              <li>📚 <strong>Access Resources:</strong> Download our constitution, policies, and educational materials</li>
              <li>👥 <strong>Apply for Membership:</strong> Become an official UFA member to unlock exclusive benefits</li>
              <li>📧 <strong>Stay Updated:</strong> Receive regular updates about our initiatives and opportunities</li>
            </ul>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
            <h3 style="color: #15803d; margin-top: 0;">🎉 Special Welcome Offer</h3>
            <p style="color: #4b5563; line-height: 1.6; margin: 0;">
              As a new member of our community, you're eligible for our special welcome package! 
              <a href="https://ufa.org/membership" style="color: #10b981; font-weight: bold;">Apply for membership today</a> 
              and join thousands of others making a difference.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://ufa.org/events" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">Browse Events</a>
            <a href="https://ufa.org/membership" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">Apply for Membership</a>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6; margin-top: 30px;">
            If you have any questions or need assistance, please don't hesitate to contact us at 
            <a href="mailto:info@ufa.org" style="color: #10b981;">info@ufa.org</a>.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
          <p>United Future Alliance | Building a Better Future Together</p>
          <p>This email was sent to {{email}}. If you no longer wish to receive these emails, you can <a href="#" style="color: #10b981;">unsubscribe</a>.</p>
        </div>
      </div>
    `
  }
};

// Email Service Class
class EmailService {
  private isConfigured: boolean = false;

  constructor() {
    this.initializeEmailJS();
  }

  private initializeEmailJS(): void {
    if (EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.publicKey) {
      emailjs.init(EMAILJS_CONFIG.publicKey);
      this.isConfigured = true;
      console.log('✅ EmailJS initialized successfully');
    } else {
      console.warn('⚠️ EmailJS not configured. Please set environment variables.');
    }
  }

  // Send event registration confirmation email
  async sendEventRegistrationConfirmation(data: {
    to: string;
    firstName: string;
    lastName: string;
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
    confirmationCode: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isConfigured) {
        console.log('📧 EmailJS not configured, simulating email send');
        return {
          success: true,
          message: 'Email sent successfully (simulated)'
        };
      }

      const templateParams = {
        to_email: data.to,
        to_name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.to,
        emailSubject: `Event Registration Confirmed - ${data.eventTitle}`,
        emailType: 'Event Registration Confirmed',
        emailContent: `Thank you for registering for ${data.eventTitle}. Your registration has been confirmed and we're excited to have you join us!`,
        detailsTitle: 'Event Details',
        detailsContent: `Event: ${data.eventTitle}\nDate: ${data.eventDate}\nLocation: ${data.eventLocation}\nConfirmation Code: ${data.confirmationCode}`,
        actionsTitle: "What's Next?",
        actionsContent: `• Save this confirmation code for your records\n• You'll receive event reminders closer to the date\n• Check your email for any updates or changes`,
        buttonsContent: `View All Events | Visit Our Website`,
        from_name: EMAILJS_CONFIG.fromName,
        reply_to: EMAILJS_CONFIG.fromEmail
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      console.log('✅ Event registration email sent successfully:', result);
      return {
        success: true,
        message: 'Event registration confirmation email sent successfully'
      };
    } catch (error) {
      console.error('❌ Failed to send event registration email:', error);
      return {
        success: false,
        message: 'Failed to send email. Please try again.'
      };
    }
  }

  // Send membership application confirmation email
  async sendMembershipConfirmation(data: {
    to: string;
    firstName: string;
    lastName: string;
    registrationId: string;
    applicationDate: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isConfigured) {
        console.log('📧 EmailJS not configured, simulating email send');
        return {
          success: true,
          message: 'Email sent successfully (simulated)'
        };
      }

      const templateParams = {
        to_email: data.to,
        to_name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.to,
        emailSubject: 'Membership Application Received - UFA',
        emailType: 'Membership Application Confirmed',
        emailContent: `Thank you for your membership application to the United Future Alliance! We have received your application and it is currently under review.`,
        detailsTitle: 'Application Details',
        detailsContent: `Name: ${data.firstName} ${data.lastName}\nEmail: ${data.to}\nRegistration ID: ${data.registrationId}\nApplication Date: ${data.applicationDate}`,
        actionsTitle: 'Review Process',
        actionsContent: `• Your application will be reviewed by our membership committee\n• You will receive an update within 5-7 business days\n• Keep your Registration ID for future reference\n• Check your email regularly for updates`,
        buttonsContent: `Browse Events | Visit Our Website`,
        from_name: EMAILJS_CONFIG.fromName,
        reply_to: EMAILJS_CONFIG.fromEmail
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      console.log('✅ Membership confirmation email sent successfully:', result);
      return {
        success: true,
        message: 'Membership application confirmation email sent successfully'
      };
    } catch (error) {
      console.error('❌ Failed to send membership confirmation email:', error);
      return {
        success: false,
        message: 'Failed to send email. Please try again.'
      };
    }
  }

  // Send newsletter welcome email
  async sendNewsletterWelcome(data: {
    to: string;
    firstName?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isConfigured) {
        console.log('📧 EmailJS not configured, simulating email send');
        return {
          success: true,
          message: 'Email sent successfully (simulated)'
        };
      }

      const templateParams = {
        to_email: data.to,
        to_name: data.firstName || 'Friend',
        firstName: data.firstName || 'Friend',
        email: data.to,
        from_name: EMAILJS_CONFIG.fromName,
        reply_to: EMAILJS_CONFIG.fromEmail
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      console.log('✅ Newsletter welcome email sent successfully:', result);
      return {
        success: true,
        message: 'Newsletter welcome email sent successfully'
      };
    } catch (error) {
      console.error('❌ Failed to send newsletter welcome email:', error);
      return {
        success: false,
        message: 'Failed to send email. Please try again.'
      };
    }
  }

  // Send user welcome email (for new account signup)
  async sendUserWelcome(data: {
    to: string;
    firstName: string;
    lastName: string;
    signupDate: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isConfigured) {
        console.log('📧 EmailJS not configured, simulating user welcome email send');
        return {
          success: true,
          message: 'User welcome email sent successfully (simulated)'
        };
      }

      const templateParams = {
        to_email: data.to,
        to_name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.to,
        emailSubject: 'Welcome to United Future Alliance!',
        emailType: 'Welcome to Our Community!',
        emailContent: `Welcome to the United Future Alliance! We're thrilled to have you join our community of changemakers working together to build a better future.`,
        detailsTitle: 'Your Account Details',
        detailsContent: `Name: ${data.firstName} ${data.lastName}\nEmail: ${data.to}\nAccount Created: ${data.signupDate}`,
        actionsTitle: 'What You Can Do Now',
        actionsContent: `📅 Browse Events: Discover upcoming community events and register to attend\n📚 Access Resources: Download our constitution, policies, and educational materials\n👥 Apply for Membership: Become an official UFA member to unlock exclusive benefits\n📧 Stay Updated: Receive regular updates about our initiatives and opportunities`,
        buttonsContent: `Browse Events | Apply for Membership`,
        from_name: EMAILJS_CONFIG.fromName,
        reply_to: EMAILJS_CONFIG.fromEmail
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      console.log('✅ User welcome email sent successfully:', result);
      return {
        success: true,
        message: 'User welcome email sent successfully'
      };
    } catch (error) {
      console.error('❌ Failed to send user welcome email:', error);
      return {
        success: false,
        message: 'Failed to send welcome email. Please try again.'
      };
    }
  }

  // Send custom email
  async sendCustomEmail(data: {
    to: string;
    subject: string;
    message: string;
    fromName?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isConfigured) {
        console.log('📧 EmailJS not configured, simulating email send');
        return {
          success: true,
          message: 'Email sent successfully (simulated)'
        };
      }

      const templateParams = {
        to_email: data.to,
        to_name: data.to.split('@')[0],
        subject: data.subject,
        message: data.message,
        from_name: data.fromName || EMAILJS_CONFIG.fromName,
        reply_to: EMAILJS_CONFIG.fromEmail
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      console.log('✅ Custom email sent successfully:', result);
      return {
        success: true,
        message: 'Email sent successfully'
      };
    } catch (error) {
      console.error('❌ Failed to send custom email:', error);
      return {
        success: false,
        message: 'Failed to send email. Please try again.'
      };
    }
  }

  // Check if email service is configured
  isEmailConfigured(): boolean {
    return this.isConfigured;
  }

  // Get email configuration status
  getConfigurationStatus(): {
    configured: boolean;
    serviceId: string;
    hasPublicKey: boolean;
  } {
    return {
      configured: this.isConfigured,
      serviceId: EMAILJS_CONFIG.serviceId,
      hasPublicKey: !!EMAILJS_CONFIG.publicKey
    };
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export types
export interface EmailTemplate {
  id: string;
  subject: string;
  template: string;
}

export interface EmailData {
  to: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

