# M-Pesa Integration Setup Guide

This guide will help you set up M-Pesa payment integration for the UFA membership registration system.

## Prerequisites

1. **M-Pesa Business Account**: You need an active M-Pesa business account with Safaricom
2. **Paybill or Till Number**: Required for receiving payments
3. **Developer Account**: Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke/)

## Step 1: Register for M-Pesa API Access

1. Visit [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create an account and log in
3. Navigate to "My Apps" and create a new app
4. Select "M-Pesa API" as the service
5. Note down your Consumer Key and Consumer Secret

## Step 2: Get Your Business Credentials

1. **Business Short Code**: Your Paybill or Till number (e.g., 174379 for testing)
2. **Passkey**: Generated from your business account settings
3. **Callback URL**: Your server endpoint for payment notifications

## Step 3: Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# M-Pesa API Configuration
REACT_APP_MPESA_CONSUMER_KEY=your_consumer_key_here
REACT_APP_MPESA_CONSUMER_SECRET=your_consumer_secret_here
REACT_APP_MPESA_BUSINESS_SHORT_CODE=174379
REACT_APP_MPESA_PASSKEY=your_passkey_here
REACT_APP_MPESA_ENVIRONMENT=sandbox
REACT_APP_MPESA_CALLBACK_URL=https://your-domain.com/api/mpesa/callback
```

## Step 4: Testing

### Sandbox Environment
- Use the test credentials provided by Safaricom
- Test with phone numbers: 254708374149, 254711111111
- Test amounts: 1-70000 KES

### Test Phone Numbers
- 254708374149 (Always successful)
- 254711111111 (Always fails)
- 254722222222 (Always timeout)

## Step 5: Production Setup

1. **Switch to Production**:
   - Change `REACT_APP_MPESA_ENVIRONMENT` to `production`
   - Update API endpoints to production URLs
   - Use your actual business credentials

2. **Callback URL Setup**:
   - Set up a secure endpoint to handle payment notifications
   - Implement proper validation and security measures

## Step 6: Security Considerations

1. **Never expose sensitive credentials** in client-side code
2. **Use environment variables** for all API keys
3. **Implement server-side validation** for payment callbacks
4. **Use HTTPS** for all production endpoints

## API Endpoints

### Sandbox URLs
- OAuth: `https://sandbox.safaricom.co.ke/oauth/v1/generate`
- STK Push: `https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`
- STK Query: `https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query`

### Production URLs
- OAuth: `https://api.safaricom.co.ke/oauth/v1/generate`
- STK Push: `https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest`
- STK Query: `https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query`

## Payment Flow

1. **User submits membership form**
2. **M-Pesa payment modal appears**
3. **User enters phone number**
4. **STK Push request sent to user's phone**
5. **User enters M-Pesa PIN**
6. **Payment processed**
7. **Membership application submitted**

## Troubleshooting

### Common Issues

1. **Invalid Phone Number Format**
   - Ensure phone numbers are in format: 254XXXXXXXXX
   - Remove any spaces or special characters

2. **Authentication Errors**
   - Verify Consumer Key and Secret
   - Check if credentials are properly set in environment variables

3. **Payment Timeout**
   - Implement proper timeout handling
   - Provide user feedback for failed payments

4. **Callback Issues**
   - Ensure callback URL is accessible
   - Implement proper error handling

## Support

- **Safaricom Developer Support**: [developer.safaricom.co.ke/support](https://developer.safaricom.co.ke/support)
- **M-Pesa API Documentation**: [developer.safaricom.co.ke/docs](https://developer.safaricom.co.ke/docs)

## Cost Structure

- **Registration Fee**: KES 200 (one-time)
- **Monthly Contribution**: KES 100 per month
- **M-Pesa Transaction Fees**: As per Safaricom's current rates

## Development vs Production

The system includes a development mode that simulates payments for testing purposes. Set `isDevelopment={true}` in the MpesaPayment component for testing without real M-Pesa transactions.

To go live:
1. Set `isDevelopment={false}`
2. Update environment variables to production values
3. Test thoroughly with real M-Pesa accounts
4. Deploy with proper security measures
