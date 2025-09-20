import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertCircle,
  Phone,
  DollarSign
} from 'lucide-react';
import { 
  initiateSTKPush, 
  querySTKPushStatus, 
  simulatePayment, 
  validatePhoneNumber, 
  formatAmount,
  getPaymentStatusMessage 
} from '../lib/mpesaService';
import { MpesaSTKPushRequest, MpesaSTKPushResponse } from '../types';

interface MpesaPaymentProps {
  amount: number;
  accountReference: string;
  transactionDescription: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
  isDevelopment?: boolean;
}

export default function MpesaPayment({
  amount,
  accountReference,
  transactionDescription,
  onPaymentSuccess,
  onPaymentError,
  onCancel,
  isDevelopment = false
}: MpesaPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'initiated' | 'processing' | 'success' | 'failed'>('idle');
  const [error, setError] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Poll for payment status when payment is initiated
  useEffect(() => {
    if (paymentStatus === 'initiated' && checkoutRequestId && !isDevelopment) {
      const pollInterval = setInterval(async () => {
        try {
          const status = await querySTKPushStatus(checkoutRequestId);
          
          if (status.ResultCode === '0') {
            setPaymentStatus('success');
            setStatusMessage('Payment completed successfully!');
            onPaymentSuccess({
              mpesaReceiptNumber: status.MpesaReceiptNumber,
              transactionDate: new Date(),
              amount: amount,
              phoneNumber: phoneNumber
            });
            clearInterval(pollInterval);
          } else if (status.ResultCode === '1032' || status.ResultCode === '1') {
            setPaymentStatus('failed');
            setStatusMessage('Payment was cancelled');
            clearInterval(pollInterval);
          } else if (status.ResultCode && status.ResultCode !== '0') {
            setPaymentStatus('failed');
            setStatusMessage(getPaymentStatusMessage(status.ResultCode));
            clearInterval(pollInterval);
          }
        } catch (error) {
          console.error('Error polling payment status:', error);
        }
      }, 3000);

      // Stop polling after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (paymentStatus === 'initiated') {
          setPaymentStatus('failed');
          setStatusMessage('Payment timeout. Please try again.');
        }
      }, 300000);

      return () => clearInterval(pollInterval);
    }
  }, [paymentStatus, checkoutRequestId, isDevelopment, amount, phoneNumber, onPaymentSuccess]);

  const handlePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678)');
      return;
    }

    setIsLoading(true);
    setError('');
    setPaymentStatus('processing');

    try {
      const request: MpesaSTKPushRequest = {
        phoneNumber: phoneNumber,
        amount: amount,
        accountReference: accountReference,
        transactionDescription: transactionDescription,
      };

      let response: MpesaSTKPushResponse;

      if (isDevelopment) {
        // Use simulation for development
        response = await simulatePayment(request);
      } else {
        // Use real M-Pesa API
        response = await initiateSTKPush(request);
      }

      if (response.responseCode === '0') {
        setCheckoutRequestId(response.checkoutRequestId);
        setPaymentStatus('initiated');
        setStatusMessage('Payment request sent to your phone. Please check your M-Pesa app and enter your PIN.');
        
        if (isDevelopment) {
          // Simulate success after 3 seconds in development
          setTimeout(() => {
            setPaymentStatus('success');
            setStatusMessage('Payment completed successfully! (Simulated)');
            onPaymentSuccess({
              mpesaReceiptNumber: `MP${Date.now()}`,
              transactionDate: new Date(),
              amount: amount,
              phoneNumber: phoneNumber
            });
          }, 3000);
        }
      } else {
        setPaymentStatus('failed');
        setError(response.responseDescription || 'Payment request failed');
      }
    } catch (error) {
      setPaymentStatus('failed');
      setError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      onPaymentError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setPaymentStatus('idle');
    setError('');
    setStatusMessage('');
    setCheckoutRequestId('');
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
      case 'initiated':
        return <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'failed':
        return <XCircle className="w-8 h-8 text-red-600" />;
      default:
        return <Smartphone className="w-8 h-8 text-blue-600" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'processing':
      case 'initiated':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className={`border-2 rounded-xl p-6 ${getStatusColor()}`}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {paymentStatus === 'idle' && 'Pay with M-Pesa'}
            {paymentStatus === 'processing' && 'Processing Payment...'}
            {paymentStatus === 'initiated' && 'Check Your Phone'}
            {paymentStatus === 'success' && 'Payment Successful!'}
            {paymentStatus === 'failed' && 'Payment Failed'}
          </h3>
          <p className="text-lg font-bold text-emerald-600">
            {formatAmount(amount)}
          </p>
        </div>

        {/* Phone Number Input */}
        {paymentStatus === 'idle' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              M-Pesa Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0712345678 or 254712345678"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter your M-Pesa registered phone number
            </p>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && (
          <div className="mb-6">
            <div className={`p-4 rounded-lg ${
              paymentStatus === 'success' ? 'bg-green-100 text-green-800' :
              paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              <div className="flex items-center">
                {paymentStatus === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
                {paymentStatus === 'failed' && <XCircle className="w-5 h-5 mr-2" />}
                {paymentStatus === 'initiated' && <AlertCircle className="w-5 h-5 mr-2" />}
                <span className="text-sm font-medium">{statusMessage}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="p-4 rounded-lg bg-red-100 text-red-800">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {paymentStatus === 'idle' && (
            <>
              <button
                onClick={handlePayment}
                disabled={isLoading || !phoneNumber.trim()}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    Pay with M-Pesa
                  </>
                )}
              </button>
              <button
                onClick={onCancel}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </>
          )}

          {paymentStatus === 'failed' && (
            <>
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={onCancel}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </>
          )}

          {paymentStatus === 'success' && (
            <button
              onClick={onCancel}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Continue
            </button>
          )}
        </div>

        {/* Development Mode Notice */}
        {isDevelopment && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
              <span className="text-xs text-yellow-800">
                Development Mode: Payments are simulated
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
