import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, FileText, CheckCircle } from 'lucide-react';
import { Event } from '../types';
import { eventRegistrationService } from '../lib/eventRegistrationService';

interface EventRegistrationModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onRegistrationSuccess?: (confirmationCode: string) => void;
}

export default function EventRegistrationModal({ 
  event, 
  isOpen, 
  onClose, 
  onRegistrationSuccess 
}: EventRegistrationModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
    county: '',
    constituency: '',
    interests: [] as string[],
    additionalInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<{
    success: boolean;
    message: string;
    confirmationCode?: string;
  } | null>(null);

  const kenyanCounties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu',
    'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa',
    'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
    'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
    'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  const interestOptions = [
    'Education', 'Healthcare', 'Infrastructure', 'Technology', 'Youth Development',
    'Women Empowerment', 'Community Development', 'Environmental Conservation',
    'Economic Development', 'Social Justice', 'Agriculture', 'Tourism'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const optionValue = name.split('_')[1];

      setFormData(prev => ({
        ...prev,
        interests: checked
          ? [...prev.interests, optionValue]
          : prev.interests.filter(item => item !== optionValue)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setRegistrationResult(null);

    try {
      const result = await eventRegistrationService.registerForEvent(
        event.id,
        event.title,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          idNumber: formData.idNumber,
          county: formData.county,
          constituency: formData.constituency,
          interests: formData.interests,
          additionalInfo: formData.additionalInfo
        }
      );

      setRegistrationResult(result);

      if (result.success && result.confirmationCode) {
        onRegistrationSuccess?.(result.confirmationCode);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setRegistrationResult({
        success: false,
        message: 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      idNumber: '',
      county: '',
      constituency: '',
      interests: [],
      additionalInfo: ''
    });
    setRegistrationResult(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Register for Event</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Event Info */}
        <div className="p-6 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
          <div className="text-sm text-gray-600">
            {new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Registration Form */}
        {!registrationResult ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  National ID Number
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    County
                  </label>
                  <select
                    name="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select County</option>
                    {kenyanCounties.map(county => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Constituency
                  </label>
                  <input
                    type="text"
                    name="constituency"
                    value={formData.constituency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Areas of Interest</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {interestOptions.map(interest => (
                  <label key={interest} className="flex items-center">
                    <input
                      type="checkbox"
                      name={`interest_${interest}`}
                      checked={formData.interests.includes(interest)}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Additional Information
              </h4>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={4}
                placeholder="Any additional information you'd like to share..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Registering...
                  </>
                ) : (
                  'Register for Event'
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Success/Error Message */
          <div className="p-6">
            <div className={`text-center ${registrationResult.success ? 'text-green-600' : 'text-red-600'}`}>
              <div className="mb-4">
                {registrationResult.success ? (
                  <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                ) : (
                  <X className="w-16 h-16 mx-auto text-red-500" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {registrationResult.success ? 'Registration Successful!' : 'Registration Failed'}
              </h3>
              <p className="text-gray-700 mb-4">{registrationResult.message}</p>
              
              {registrationResult.success && registrationResult.confirmationCode && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-800 mb-2">
                    <strong>Confirmation Code:</strong>
                  </p>
                  <p className="text-2xl font-mono font-bold text-green-900">
                    {registrationResult.confirmationCode}
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Please save this code for your records
                  </p>
                </div>
              )}
              
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

