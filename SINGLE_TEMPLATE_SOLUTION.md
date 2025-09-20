# 🎯 Single Template Solution for EmailJS

## 🚀 **Problem Solved!**

Instead of creating multiple templates (which hit the free tier limit), we now use **ONE universal template** that handles all email types dynamically!

## 📧 **What You Need to Do**

### **Step 1: Create ONE Universal Template in EmailJS**

1. **Go to Email Templates** → **Create New Template**
2. **Template Name**: `UFA Universal Email`
3. **Subject**: `{{emailSubject}}` (this will be dynamic)

### **Step 2: Copy This Universal HTML Template**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">United Future Alliance</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">{{emailType}}</p>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1f2937; margin-top: 0;">Hello {{firstName}}!</h2>
    
    <div style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
      {{emailContent}}
    </div>
    
    {{#if showDetails}}
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
      <h3 style="color: #1f2937; margin-top: 0;">{{detailsTitle}}</h3>
      {{detailsContent}}
    </div>
    {{/if}}
    
    {{#if showActions}}
    <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #1e40af; margin-top: 0;">{{actionsTitle}}</h3>
      {{actionsContent}}
    </div>
    {{/if}}
    
    {{#if showOffer}}
    <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
      <h3 style="color: #15803d; margin-top: 0;">{{offerTitle}}</h3>
      <p style="color: #4b5563; line-height: 1.6; margin: 0;">{{offerContent}}</p>
    </div>
    {{/if}}
    
    {{#if showButtons}}
    <div style="text-align: center; margin-top: 30px;">
      {{buttonsContent}}
    </div>
    {{/if}}
    
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
```

4. **Save the template** and copy the Template ID

### **Step 3: Configure Environment Variables**

Create your `.env` file with:
```bash
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

Replace with your actual credentials from EmailJS.

### **Step 4: Restart Your Server**

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

## 🎯 **How It Works**

### **One Template, Multiple Email Types:**

1. **User Welcome Email**:
   - Subject: "Welcome to United Future Alliance!"
   - Content: Account details, platform features, membership offer
   - Buttons: Browse Events, Apply for Membership

2. **Event Registration Email**:
   - Subject: "Event Registration Confirmed - [Event Name]"
   - Content: Event details, confirmation code, next steps
   - Buttons: View All Events, Visit Website

3. **Membership Confirmation Email**:
   - Subject: "Membership Application Received - UFA"
   - Content: Application details, review process, registration ID
   - Buttons: Browse Events, Visit Website

### **Dynamic Content System:**

The template uses dynamic variables:
- `{{emailSubject}}` - Changes based on email type
- `{{emailType}}` - Header text (Welcome, Event Registration, etc.)
- `{{emailContent}}` - Main message content
- `{{showDetails}}` - Shows/hides details section
- `{{detailsTitle}}` - Title for details section
- `{{detailsContent}}` - HTML content for details
- `{{showActions}}` - Shows/hides actions section
- `{{actionsTitle}}` - Title for actions section
- `{{actionsContent}}` - HTML content for actions
- `{{showOffer}}` - Shows/hides special offer section
- `{{showButtons}}` - Shows/hides action buttons
- `{{buttonsContent}}` - HTML for buttons

## ✅ **Benefits of This Solution**

1. **No Template Limit**: Uses only 1 template instead of 3+
2. **Professional Design**: All emails have consistent UFA branding
3. **Dynamic Content**: Same template adapts to different email types
4. **Easy Maintenance**: Update one template to change all emails
5. **Cost Effective**: Stays within EmailJS free tier limits

## 🧪 **Testing**

### **Test All Email Types:**

1. **User Welcome**: Create a new account
2. **Event Registration**: Register for an event
3. **Membership Confirmation**: Submit a membership application
4. **Custom Email**: Use admin dashboard to send custom emails

### **What to Check:**

- ✅ **Subject lines** are correct for each email type
- ✅ **Content** is appropriate for each email type
- ✅ **Buttons** are relevant to each email type
- ✅ **UFA branding** is consistent across all emails
- ✅ **Emails arrive** in your inbox (not spam)

## 🎉 **Current Status**

- ✅ **Universal Template**: Created and ready
- ✅ **Email Service**: Updated to use dynamic content
- ✅ **All Email Types**: Configured (Welcome, Event, Membership)
- ✅ **Professional Design**: UFA branding maintained
- ✅ **Free Tier Compatible**: Uses only 1 template

## 🚀 **Next Steps**

1. **Create the universal template** in EmailJS dashboard
2. **Add your credentials** to the `.env` file
3. **Restart your server**
4. **Test all email types** to ensure they work correctly

---

**This solution gives you professional, branded emails for all types while staying within EmailJS free tier limits!** 🎯
