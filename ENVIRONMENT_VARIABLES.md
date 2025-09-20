# Environment Variables Setup

## 📋 **Required Environment Variables**

Create a `.env` file in the root directory with the following variables:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# M-Pesa Configuration (Optional)
VITE_MPESA_CONSUMER_KEY=your_mpesa_consumer_key
VITE_MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
VITE_MPESA_BUSINESS_SHORT_CODE=your_business_short_code
VITE_MPESA_PASSKEY=your_mpesa_passkey
VITE_MPESA_CALLBACK_URL=your_callback_url
```

## 🔧 **How to Get EmailJS Credentials**

### **Step 1: Create EmailJS Account**
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### **Step 2: Create Email Service**
1. Go to **Email Services** in your dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. Copy the **Service ID**

### **Step 3: Create Email Template**
1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use the template from `src/lib/emailService.ts`
4. Copy the **Template ID**

### **Step 4: Get Public Key**
1. Go to **Account** in your dashboard
2. Find your **Public Key** in the API Keys section
3. Copy the **Public Key**

### **Step 5: Update Environment Variables**
1. Create a `.env` file in your project root
2. Add the EmailJS credentials:
   ```bash
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
   ```

## 🚀 **Testing Email Functionality**

Once configured, the email service will:
- ✅ Send event registration confirmations
- ✅ Send membership application confirmations
- ✅ Send newsletter welcome emails
- ✅ Handle custom email sending
- ✅ Fall back to simulation if not configured

## 📧 **Email Templates Included**

1. **Event Registration Confirmation**
   - Professional design with UFA branding
   - Event details and confirmation code
   - Next steps information

2. **Membership Application Confirmation**
   - Application details and registration ID
   - Review process information
   - Membership benefits overview

3. **Newsletter Welcome**
   - Welcome message and benefits
   - Subscription confirmation
   - Unsubscribe option

## 🔒 **Security Notes**

- Never commit your `.env` file to version control
- Use environment variables for all sensitive data
- EmailJS handles email delivery securely
- Templates are customizable and professional
