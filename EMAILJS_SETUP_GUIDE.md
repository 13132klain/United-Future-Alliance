# EmailJS Setup Guide for UFA Website

## 🎯 **Overview**

This guide will help you set up EmailJS to enable real email sending functionality for the UFA website. EmailJS allows you to send emails directly from your frontend application without needing a backend server.

## 🚀 **Step-by-Step Setup**

### **Step 1: Create EmailJS Account**

1. **Go to EmailJS**: Visit [https://www.emailjs.com/](https://www.emailjs.com/)
2. **Sign Up**: Create a free account using your email
3. **Verify Email**: Check your email and click the verification link
4. **Complete Profile**: Fill in your basic information

### **Step 2: Create Email Service**

1. **Go to Email Services**: In your EmailJS dashboard, click "Email Services"
2. **Add New Service**: Click "Add New Service"
3. **Choose Provider**: Select your email provider:
   - **Gmail** (Recommended for testing)
   - **Outlook/Hotmail**
   - **Yahoo Mail**
   - **Custom SMTP**

#### **For Gmail Setup:**
1. Select **Gmail** as your service
2. Click **Connect Account**
3. Sign in with your Gmail account
4. Grant permissions to EmailJS
5. **Copy the Service ID** (e.g., `service_xxxxxxx`)

### **Step 3: Create Email Templates**

1. **Go to Email Templates**: Click "Email Templates" in your dashboard
2. **Create New Template**: Click "Create New Template"
3. **Template Settings**:
   - **Template Name**: `UFA Event Registration`
   - **Template ID**: This will be auto-generated (e.g., `template_xxxxxxx`)

#### **Template Content**:

**Subject**: `Event Registration Confirmed - {{eventTitle}}`

**HTML Content**:
```html
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
    <p>This email was sent to {{to_email}}. If you no longer wish to receive these emails, you can <a href="#" style="color: #10b981;">unsubscribe</a>.</p>
  </div>
</div>
```

4. **Save Template**: Click "Save" to create the template

### **Step 4: Get Public Key**

1. **Go to Account**: Click "Account" in your EmailJS dashboard
2. **API Keys**: Find your **Public Key** (e.g., `xxxxxxxxxxxxxxx`)
3. **Copy the Public Key**

### **Step 5: Configure Environment Variables**

1. **Create .env file**: In your project root, create a `.env` file
2. **Add EmailJS credentials**:
   ```bash
   # EmailJS Configuration
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
   ```

3. **Replace the values** with your actual EmailJS credentials

### **Step 6: Test Email Functionality**

1. **Restart Development Server**: Stop and restart your development server
2. **Go to Admin Dashboard**: Navigate to Admin Dashboard → Email Management
3. **Check Configuration Status**: Verify that EmailJS is configured
4. **Send Test Email**: Use the "Send Email" tab to send a test email
5. **Test Event Registration**: Register for an event to test automatic emails

## 📧 **Email Templates Included**

The system includes the following email templates:

### **1. Event Registration Confirmation**
- **Triggered**: When users register for events
- **Content**: Event details, confirmation code, next steps
- **Design**: Professional with UFA branding

### **2. Membership Application Confirmation**
- **Triggered**: When users submit membership applications
- **Content**: Application details, registration ID, review process
- **Design**: Purple theme with membership benefits

### **3. Newsletter Welcome**
- **Triggered**: When users subscribe to newsletter
- **Content**: Welcome message, benefits, unsubscribe option
- **Design**: Orange theme with community focus

### **4. Custom Email**
- **Triggered**: When admins send custom emails
- **Content**: Custom subject and message
- **Design**: Simple and professional

## 🔧 **Advanced Configuration**

### **Multiple Email Services**
You can set up multiple email services for different purposes:
- **Primary Service**: For general emails
- **Newsletter Service**: For newsletter emails
- **Admin Service**: For admin notifications

### **Template Variables**
Templates support dynamic variables:
- `{{firstName}}` - User's first name
- `{{lastName}}` - User's last name
- `{{email}}` - User's email address
- `{{eventTitle}}` - Event title
- `{{confirmationCode}}` - Confirmation code
- `{{registrationId}}` - Registration ID

### **Email Limits**
- **Free Plan**: 200 emails/month
- **Paid Plans**: Higher limits available
- **Rate Limiting**: Built-in to prevent spam

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"EmailJS not configured" message**
   - Check that all environment variables are set
   - Restart your development server
   - Verify the variable names start with `VITE_`

2. **Emails not sending**
   - Check your EmailJS service configuration
   - Verify your email provider settings
   - Check the browser console for errors

3. **Template variables not working**
   - Ensure variable names match exactly
   - Check that variables are passed in the email data
   - Verify template syntax

4. **Emails going to spam**
   - Set up SPF, DKIM, and DMARC records
   - Use a professional email address
   - Avoid spam trigger words

### **Testing Tips**

1. **Use Gmail for testing**: Most reliable for development
2. **Check spam folder**: Emails might end up there initially
3. **Test with different email providers**: Ensure compatibility
4. **Monitor EmailJS dashboard**: Check delivery status

## 📊 **Monitoring and Analytics**

### **EmailJS Dashboard**
- **Delivery Status**: Track email delivery
- **Open Rates**: Monitor email engagement
- **Error Logs**: Debug delivery issues
- **Usage Statistics**: Monitor email limits

### **Best Practices**
1. **Test thoroughly**: Send test emails before going live
2. **Monitor delivery**: Check EmailJS dashboard regularly
3. **Handle errors gracefully**: Don't fail registration if email fails
4. **Respect limits**: Monitor your monthly email quota
5. **Keep templates updated**: Maintain professional appearance

## 🎉 **Success!**

Once configured, your UFA website will:
- ✅ Send automatic event registration confirmations
- ✅ Send membership application confirmations
- ✅ Allow admins to send custom emails
- ✅ Provide professional email templates
- ✅ Handle email failures gracefully
- ✅ Support multiple email types

Your email system is now ready for production use! 🚀

