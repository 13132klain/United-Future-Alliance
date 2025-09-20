import { MpesaSTKPushRequest, MpesaSTKPushResponse, MpesaPayment } from '../types';

// M-Pesa API configuration
const MPESA_CONFIG = {
  // These would be environment variables in production
  consumerKey: import.meta.env.VITE_MPESA_CONSUMER_KEY || 'your_consumer_key',
  consumerSecret: import.meta.env.VITE_MPESA_CONSUMER_SECRET || 'your_consumer_secret',
  businessShortCode: import.meta.env.VITE_MPESA_BUSINESS_SHORT_CODE || '174379', // Test shortcode
  passkey: import.meta.env.VITE_MPESA_PASSKEY || 'your_passkey',
  environment: import.meta.env.VITE_MPESA_ENVIRONMENT || 'sandbox', // 'sandbox' or 'production'
  callbackUrl: import.meta.env.VITE_MPESA_CALLBACK_URL || 'https://your-domain.com/api/mpesa/callback',
};

// Generate access token for M-Pesa API
async function getAccessToken(): Promise<string> {
  const auth = btoa(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`);
  
  const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get M-Pesa access token');
  }

  const data = await response.json();
  return data.access_token;
}

// Generate timestamp for M-Pesa API
function generateTimestamp(): string {
  return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
}

// Generate password for M-Pesa API
function generatePassword(): string {
  const timestamp = generateTimestamp();
  const password = btoa(`${MPESA_CONFIG.businessShortCode}${MPESA_CONFIG.passkey}${timestamp}`);
  return password;
}

// Format phone number for M-Pesa (254XXXXXXXXX)
function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle different formats
  if (cleaned.startsWith('254')) {
    return cleaned;
  } else if (cleaned.startsWith('0')) {
    return '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    return '254' + cleaned;
  }
  
  return cleaned;
}

// Initiate STK Push payment
export async function initiateSTKPush(request: MpesaSTKPushRequest): Promise<MpesaSTKPushResponse> {
  try {
    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword();
    const formattedPhone = formatPhoneNumber(request.phoneNumber);

    const stkPushRequest = {
      BusinessShortCode: MPESA_CONFIG.businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: request.amount,
      PartyA: formattedPhone,
      PartyB: MPESA_CONFIG.businessShortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: request.callbackUrl || MPESA_CONFIG.callbackUrl,
      AccountReference: request.accountReference,
      TransactionDesc: request.transactionDescription,
    };

    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errorMessage || 'STK Push request failed');
    }

    const data = await response.json();
    
    return {
      merchantRequestId: data.MerchantRequestID,
      checkoutRequestId: data.CheckoutRequestID,
      responseCode: data.ResponseCode,
      responseDescription: data.ResponseDescription,
      customerMessage: data.CustomerMessage,
    };
  } catch (error) {
    console.error('STK Push error:', error);
    throw error;
  }
}

// Query STK Push status
export async function querySTKPushStatus(checkoutRequestId: string): Promise<any> {
  try {
    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword();

    const queryRequest = {
      BusinessShortCode: MPESA_CONFIG.businessShortCode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryRequest),
    });

    if (!response.ok) {
      throw new Error('Failed to query STK Push status');
    }

    return await response.json();
  } catch (error) {
    console.error('STK Push query error:', error);
    throw error;
  }
}

// Simulate payment for development/testing
export async function simulatePayment(request: MpesaSTKPushRequest): Promise<MpesaSTKPushResponse> {
  // This is a mock function for development
  console.log('Simulating M-Pesa payment:', request);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate success response
  return {
    merchantRequestId: `ws_CO_${Date.now()}`,
    checkoutRequestId: `ws_CO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    responseCode: '0',
    responseDescription: 'Success. Request accepted for processing',
    customerMessage: 'Success. Request accepted for processing',
  };
}

// Validate phone number format
export function validatePhoneNumber(phoneNumber: string): boolean {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid Kenyan phone number
  if (cleaned.startsWith('254')) {
    return cleaned.length === 12;
  } else if (cleaned.startsWith('0')) {
    return cleaned.length === 10;
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    return cleaned.length === 9;
  }
  
  return false;
}

// Format amount for display
export function formatAmount(amount: number): string {
  return `KES ${amount.toLocaleString()}`;
}

// Get payment status message
export function getPaymentStatusMessage(status: string): string {
  switch (status) {
    case '0':
      return 'Payment successful';
    case '1':
      return 'Payment cancelled by user';
    case '1032':
      return 'Request cancelled by user';
    case '1037':
      return 'Timeout in completing transaction';
    case '2001':
      return 'Wrong PIN entered';
    case '2002':
      return 'Wrong PIN entered';
    case '2003':
      return 'Wrong PIN entered';
    case '2004':
      return 'Wrong PIN entered';
    case '2005':
      return 'Wrong PIN entered';
    case '2006':
      return 'Wrong PIN entered';
    default:
      return 'Payment failed. Please try again.';
  }
}
