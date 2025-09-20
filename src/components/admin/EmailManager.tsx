import React, { useState } from 'react';
import { Mail, Send, Users, CheckCircle, XCircle, Settings, Eye } from 'lucide-react';
import { emailService } from '../../lib/emailService';

interface EmailManagerProps {
  onClose: () => void;
  onActivityUpdate?: (type: string, action: string, item: string) => void;
}

export default function EmailManager({ onClose, onActivityUpdate }: EmailManagerProps) {
  const [activeTab, setActiveTab] = useState<'send' | 'templates' | 'settings'>('send');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    message: '',
    fromName: 'United Future Alliance'
  });

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailForm.to || !emailForm.subject || !emailForm.message) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      const result = await emailService.sendCustomEmail({
        to: emailForm.to,
        subject: emailForm.subject,
        message: emailForm.message,
        fromName: emailForm.fromName
      });

      setSendResult(result);
      
      if (result.success) {
        onActivityUpdate?.('email', 'Sent', `Email to ${emailForm.to}`);
        // Reset form on success
        setEmailForm({
          to: '',
          subject: '',
          message: '',
          fromName: 'United Future Alliance'
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSendResult({
        success: false,
        message: 'Failed to send email. Please try again.'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailForm(prev => ({ ...prev, [name]: value }));
  };

  const emailConfig = emailService.getConfigurationStatus();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Management</h2>
          <p className="text-gray-600">Send emails and manage email templates</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Email Configuration Status */}
      <div className={`p-4 rounded-lg mb-6 ${emailConfig.configured ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
        <div className="flex items-center">
          {emailConfig.configured ? (
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          ) : (
            <XCircle className="w-5 h-5 text-yellow-500 mr-2" />
          )}
          <div>
            <h3 className={`font-semibold ${emailConfig.configured ? 'text-green-800' : 'text-yellow-800'}`}>
              Email Service Status
            </h3>
            <p className={`text-sm ${emailConfig.configured ? 'text-green-700' : 'text-yellow-700'}`}>
              {emailConfig.configured 
                ? 'EmailJS is configured and ready to send emails'
                : 'EmailJS is not configured. Emails will be simulated.'
              }
            </p>
            {!emailConfig.configured && (
              <p className="text-xs text-yellow-600 mt-1">
                Configure EmailJS in your environment variables to enable real email sending.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('send')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'send'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Send className="w-4 h-4 inline mr-2" />
            Send Email
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Templates
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Settings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'send' && (
        <div className="max-w-2xl">
          <form onSubmit={handleSendEmail} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Email Address *
              </label>
              <input
                type="email"
                name="to"
                value={emailForm.to}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="recipient@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Name
              </label>
              <input
                type="text"
                name="fromName"
                value={emailForm.fromName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="United Future Alliance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={emailForm.subject}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Email subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                name="message"
                value={emailForm.message}
                onChange={handleInputChange}
                required
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Your email message..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Send Result */}
          {sendResult && (
            <div className={`mt-6 p-4 rounded-lg ${sendResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center">
                {sendResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                )}
                <p className={`font-medium ${sendResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {sendResult.message}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Templates</h3>
            <p className="text-gray-600 mb-6">
              These templates are automatically used for different types of emails sent by the system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Registration Template */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Mail className="w-5 h-5 text-emerald-500 mr-2" />
                <h4 className="font-semibold text-gray-900">Event Registration</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Sent when users register for events that require registration.
              </p>
              <div className="text-xs text-gray-500">
                <p><strong>Subject:</strong> Event Registration Confirmed - {{eventTitle}}</p>
                <p><strong>Includes:</strong> Event details, confirmation code, next steps</p>
              </div>
            </div>

            {/* Membership Confirmation Template */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 text-purple-500 mr-2" />
                <h4 className="font-semibold text-gray-900">Membership Confirmation</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Sent when users submit membership applications.
              </p>
              <div className="text-xs text-gray-500">
                <p><strong>Subject:</strong> Membership Application Received - UFA</p>
                <p><strong>Includes:</strong> Application details, registration ID, review process</p>
              </div>
            </div>

            {/* Newsletter Welcome Template */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Mail className="w-5 h-5 text-orange-500 mr-2" />
                <h4 className="font-semibold text-gray-900">Newsletter Welcome</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Sent when users subscribe to the newsletter.
              </p>
              <div className="text-xs text-gray-500">
                <p><strong>Subject:</strong> Welcome to UFA Newsletter!</p>
                <p><strong>Includes:</strong> Welcome message, benefits, unsubscribe option</p>
              </div>
            </div>

            {/* User Welcome Template */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 text-blue-500 mr-2" />
                <h4 className="font-semibold text-gray-900">User Welcome</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Sent automatically when new users create an account.
              </p>
              <div className="text-xs text-gray-500">
                <p><strong>Subject:</strong> Welcome to United Future Alliance!</p>
                <p><strong>Includes:</strong> Account details, what you can do, membership offer</p>
              </div>
            </div>

            {/* Custom Email Template */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Send className="w-5 h-5 text-blue-500 mr-2" />
                <h4 className="font-semibold text-gray-900">Custom Email</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Used for custom emails sent through the admin panel.
              </p>
              <div className="text-xs text-gray-500">
                <p><strong>Subject:</strong> Custom subject</p>
                <p><strong>Includes:</strong> Custom message content</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Configuration</h3>
            <p className="text-gray-600 mb-6">
              Configure your email service settings and view current status.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">EmailJS Configuration</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service ID
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={emailConfig.serviceId || 'Not configured'}
                    disabled
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                  {emailConfig.serviceId ? (
                    <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 ml-2" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Public Key
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={emailConfig.hasPublicKey ? 'Configured' : 'Not configured'}
                    disabled
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                  {emailConfig.hasPublicKey ? (
                    <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 ml-2" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Setup Instructions</h5>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Create an EmailJS account at emailjs.com</li>
                <li>2. Set up an email service (Gmail, Outlook, etc.)</li>
                <li>3. Create email templates</li>
                <li>4. Add your credentials to environment variables</li>
                <li>5. Restart your development server</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

