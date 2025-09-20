# 🎨 Complete EmailJS Visual Editor Setup Guide

## 🚀 **Step-by-Step Complete Setup**

### **Step 1: Access EmailJS Dashboard**

1. **Open your browser** and go to: [https://dashboard.emailjs.com/](https://dashboard.emailjs.com/)
2. **Sign in** to your EmailJS account
3. **Navigate to**: "Email Templates" in the left sidebar
4. **Click**: "Create New Template" button

### **Step 2: Choose Visual Editor**

1. **Select**: "Visual Editor" (not Code Editor)
2. **Choose**: "Blank Template" or "Start from Scratch"
3. **Click**: "Create Template"

### **Step 3: Set Up Template Structure**

#### **A. Header Section (Green Background)**

1. **Add a new section**:
   - Click "Add Section" or drag from left panel
   - Choose "Full Width" section

2. **Set background**:
   - Click on the section
   - Go to "Background" settings
   - Choose "Gradient"
   - Set colors: `#10b981` to `#059669`
   - Direction: Top to bottom

3. **Add text elements**:
   - **Text 1**: "United Future Alliance"
     - Font: Bold, Large (24px+)
     - Color: White (#ffffff)
     - Alignment: Center
   - **Text 2**: "{{emailType}}"
     - Font: Medium, Medium (18px)
     - Color: White (#ffffff)
     - Alignment: Center
     - **Important**: This is a dynamic variable

4. **Add padding**:
   - Top: 30px
   - Bottom: 30px
   - Left/Right: 20px

#### **B. Main Content Section (Light Gray Background)**

1. **Add a new section**:
   - Click "Add Section"
   - Choose "Full Width" section

2. **Set background**:
   - Color: Light gray (#f9fafb)

3. **Add text elements**:
   - **Text 1**: "Hello {{firstName}}!"
     - Font: Bold, Large (20px)
     - Color: Dark gray (#1f2937)
     - Alignment: Left
   - **Text 2**: "{{emailContent}}"
     - Font: Regular, Medium (16px)
     - Color: Dark gray (#4b5563)
     - Alignment: Left
     - **Important**: This is a dynamic variable

4. **Add padding**:
   - All sides: 30px

#### **C. Details Section (White Box with Green Border)**

1. **Add a new section**:
   - Click "Add Section"
   - Choose "Full Width" section

2. **Set background**:
   - Color: White (#ffffff)

3. **Add border**:
   - Left border: 4px solid #10b981
   - Other borders: None

4. **Add text elements**:
   - **Text 1**: "{{detailsTitle}}"
     - Font: Bold, Medium (18px)
     - Color: Dark gray (#1f2937)
     - Alignment: Left
   - **Text 2**: "{{detailsContent}}"
     - Font: Regular, Medium (16px)
     - Color: Dark gray (#4b5563)
     - Alignment: Left
     - **Important**: This is a dynamic variable

5. **Add padding**:
   - All sides: 25px

#### **D. Actions Section (Light Blue Background)**

1. **Add a new section**:
   - Click "Add Section"
   - Choose "Full Width" section

2. **Set background**:
   - Color: Light blue (#eff6ff)

3. **Add text elements**:
   - **Text 1**: "{{actionsTitle}}"
     - Font: Bold, Medium (18px)
     - Color: Dark gray (#1f2937)
     - Alignment: Left
   - **Text 2**: "{{actionsContent}}"
     - Font: Regular, Medium (16px)
     - Color: Dark gray (#4b5563)
     - Alignment: Left
     - **Important**: This is a dynamic variable

4. **Add padding**:
   - All sides: 25px

#### **E. Buttons Section (Centered)**

1. **Add a new section**:
   - Click "Add Section"
   - Choose "Full Width" section

2. **Set background**:
   - Color: White (#ffffff)

3. **Add text element**:
   - **Text**: "{{buttonsContent}}"
     - Font: Regular, Medium (16px)
     - Color: Dark gray (#4b5563)
     - Alignment: Center
     - **Important**: This is a dynamic variable

4. **Add padding**:
   - All sides: 30px

#### **F. Footer Section**

1. **Add a new section**:
   - Click "Add Section"
   - Choose "Full Width" section

2. **Set background**:
   - Color: Dark gray (#1f2937)

3. **Add text elements**:
   - **Text 1**: "United Future Alliance | Building a Better Future Together"
     - Font: Regular, Small (14px)
     - Color: Light gray (#9ca3af)
     - Alignment: Center
   - **Text 2**: "This email was sent to {{email}}"
     - Font: Regular, Small (12px)
     - Color: Light gray (#9ca3af)
     - Alignment: Center

4. **Add padding**:
   - All sides: 20px

### **Step 4: Add Dynamic Variables**

For each text element that needs to be dynamic:

1. **Click on the text element**
2. **Look for "Variables" or "Dynamic Content" option**
3. **Click "Add Variable"**
4. **Enter the variable name** (e.g., `emailType`, `firstName`, etc.)

**Required Variables:**
- `{{emailType}}` - Header text (Welcome, Event Registration, etc.)
- `{{firstName}}` - User's first name
- `{{emailContent}}` - Main message content
- `{{detailsTitle}}` - Title for details section
- `{{detailsContent}}` - HTML content for details
- `{{actionsTitle}}` - Title for actions section
- `{{actionsContent}}` - HTML content for actions
- `{{buttonsContent}}` - HTML for buttons
- `{{email}}` - User's email address

### **Step 5: Style and Polish**

#### **Color Scheme:**
- **Primary Green**: #10b981
- **Dark Green**: #059669
- **Light Gray**: #f9fafb
- **White**: #ffffff
- **Dark Gray**: #1f2937
- **Medium Gray**: #4b5563
- **Light Gray Text**: #9ca3af
- **Light Blue**: #eff6ff

#### **Typography:**
- **Headers**: Bold, 18-24px
- **Body Text**: Regular, 16px
- **Small Text**: Regular, 12-14px
- **Font Family**: Arial, sans-serif (default)

#### **Spacing:**
- **Section Padding**: 20-30px
- **Element Margins**: 10-15px
- **Border Width**: 4px

### **Step 6: Save and Test**

1. **Save the template**:
   - Click "Save" button
   - Give it a name: "UFA Universal Template"
   - Click "Save Template"

2. **Copy the Template ID**:
   - After saving, you'll see the Template ID
   - Copy this ID (it looks like: `template_xxxxxxx`)

3. **Test the template**:
   - Click "Test" button
   - Fill in sample data for all variables
   - Send a test email to yourself

### **Step 7: Update Your Application**

1. **Update your .env file**:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_new_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

2. **Restart your development server**:
   ```bash
   npm run dev
   ```

### **Step 8: Test Different Email Types**

#### **A. User Welcome Email:**
- `emailType`: "Welcome to Our Community!"
- `firstName`: "John"
- `emailContent`: "Welcome to the United Future Alliance! We're thrilled to have you join our community of changemakers working together to build a better future."
- `detailsTitle`: "Your Account Details"
- `detailsContent`: "Name: John Doe<br>Email: john@example.com<br>Account Created: January 15, 2025"
- `actionsTitle`: "What You Can Do Now"
- `actionsContent`: "📅 Browse Events: Discover upcoming community events<br>📚 Access Resources: Download our constitution<br>👥 Apply for Membership: Become an official UFA member"
- `buttonsContent`: "<a href='https://ufa.org/events' style='background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;'>Browse Events</a>"

#### **B. Event Registration Email:**
- `emailType`: "Event Registration Confirmed!"
- `firstName`: "Jane"
- `emailContent`: "Your registration for the upcoming event has been confirmed. We're excited to see you there!"
- `detailsTitle`: "Event Details"
- `detailsContent`: "Event: Community Workshop<br>Date: January 20, 2025<br>Time: 2:00 PM<br>Location: UFA Headquarters"
- `actionsTitle`: "What's Next?"
- `actionsContent`: "📅 Add to Calendar: Don't forget the event date<br>📧 Contact Us: If you have any questions<br>📱 Share: Tell your friends about this event"
- `buttonsContent`: "<a href='https://ufa.org/events' style='background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;'>View Event</a>"

#### **C. Membership Confirmation Email:**
- `emailType`: "Membership Application Received!"
- `firstName`: "Mike"
- `emailContent`: "Thank you for applying to become a member of the United Future Alliance. Your application has been received and is under review."
- `detailsTitle`: "Application Details"
- `detailsContent`: "Registration ID: UFA/001/2025<br>Application Date: January 15, 2025<br>Status: Under Review<br>Payment: KES 200 (Paid)"
- `actionsTitle`: "What Happens Next?"
- `actionsContent`: "📋 Review Process: Your application will be reviewed within 5 business days<br>📧 Notification: You'll receive an email with the decision<br>💳 Monthly Fee: KES 100 monthly contribution will start after approval"
- `buttonsContent`: "<a href='https://ufa.org/membership' style='background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;'>View Membership</a>"

### **Step 9: Mobile Optimization**

The visual editor automatically creates responsive designs, but you can optimize further:

1. **Check mobile preview**:
   - Click "Mobile" view in the editor
   - Ensure text is readable
   - Check button sizes

2. **Adjust if needed**:
   - Increase font sizes for mobile
   - Adjust padding for touch screens
   - Ensure buttons are large enough

### **Step 10: Final Testing**

1. **Test all email types**:
   - User welcome
   - Event registration
   - Membership confirmation

2. **Check on different devices**:
   - Desktop
   - Mobile
   - Tablet

3. **Verify dynamic content**:
   - All variables display correctly
   - HTML content renders properly
   - Links work correctly

## 🎯 **Success Checklist**

- ✅ **Template created** in visual editor
- ✅ **All sections** added with proper styling
- ✅ **Dynamic variables** configured
- ✅ **UFA colors** applied consistently
- ✅ **Template saved** and ID copied
- ✅ **Environment variables** updated
- ✅ **All email types** tested
- ✅ **Mobile responsive** design confirmed
- ✅ **HTML content** renders properly
- ✅ **Links and buttons** work correctly

## 🚀 **You're All Set!**

Your universal EmailJS template is now ready to use with the visual editor. It will handle all your email types (welcome, event registration, membership confirmation) with a professional, branded appearance that works perfectly on all devices.

**The visual editor makes it so much easier to create and maintain your email templates!** 🎨
