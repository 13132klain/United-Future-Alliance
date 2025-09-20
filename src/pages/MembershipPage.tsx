import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  MapPin, 
  Briefcase, 
  CheckCircle, 
  Users,
  Target,
  Award,
  CreditCard,
  DollarSign,
  Smartphone
} from 'lucide-react';
import { Membership } from '../types';
import { membershipsService } from '../lib/firestoreServices';
import MpesaPayment from '../components/MpesaPayment';

interface MembershipPageProps {
  onNavigate: (page: string) => void;
}

export default function MembershipPage({ onNavigate }: MembershipPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    county: '',
    constituency: '',
    ward: '',
    occupation: '',
    organization: '',
    interests: [] as string[],
    motivation: '',
    howDidYouHear: '',
    isVolunteer: false,
    volunteerAreas: [] as string[],
    feeAgreement: false
  });

  const kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale',
    'Garissa', 'Kakamega', 'Nyeri', 'Meru', 'Machakos', 'Kitui', 'Embu', 'Isiolo',
    'Marsabit', 'Mandera', 'Wajir', 'Tana River', 'Lamu', 'Taita Taveta', 'Kilifi',
    'Kwale', 'Makueni', 'Kajiado', 'Narok', 'Bomet', 'Kericho', 'Nandi', 'Uasin Gishu',
    'Trans Nzoia', 'West Pokot', 'Samburu', 'Turkana', 'Baringo', 'Laikipia', 'Nakuru',
    'Nyandarua', 'Murang\'a', 'Kiambu', 'Kirinyaga', 'Nyeri', 'Meru', 'Tharaka Nithi',
    'Embu', 'Kitui', 'Machakos', 'Makueni', 'Kajiado', 'Narok', 'Bomet', 'Kericho',
    'Nandi', 'Uasin Gishu', 'Trans Nzoia', 'West Pokot', 'Samburu', 'Turkana', 'Baringo',
    'Laikipia', 'Nakuru', 'Nyandarua', 'Homabay', 'Kiambu', 'Kirinyaga', 'Nyeri',
    'Meru', 'Tharaka Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Kajiado', 'Narok',
    'Bomet', 'Kericho', 'Nandi', 'Uasin Gishu', 'Trans Nzoia', 'West Pokot', 'Samburu',
    'Turkana', 'Baringo', 'Laikipia','Migori','Kisii','Siaya'
  ];

  const interestOptions = [
    'Education', 'Healthcare', 'Infrastructure', 'Technology', 'Youth Development',
    'Women Empowerment', 'Community Development', 'Environmental Conservation',
    'Economic Development', 'Social Justice', 'Agriculture', 'Tourism'
  ];

  const volunteerAreas = [
    'Event Organization', 'Community Outreach', 'Education Programs', 'Healthcare Initiatives',
    'Technology Training', 'Administrative Support', 'Fundraising', 'Media & Communications',
    'Research & Policy', 'Volunteer Coordination', 'Translation Services', 'Transportation'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'isVolunteer' || name === 'feeAgreement') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        // Handle interest and volunteer area checkboxes
        const fieldName = name.startsWith('interest') ? 'interests' : 'volunteerAreas';
        const optionValue = name.split('_')[1];
        
        setFormData(prev => ({
          ...prev,
          [fieldName]: checked 
            ? [...prev[fieldName], optionValue]
            : prev[fieldName].filter(item => item !== optionValue)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show payment flow instead of directly submitting
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    setSubmitting(true);
    
    try {
      const membershipData: Omit<Membership, 'id'> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: new Date(formData.dateOfBirth),
        gender: formData.gender,
        county: formData.county,
        constituency: formData.constituency,
        ward: formData.ward || undefined,
        occupation: formData.occupation,
        organization: formData.organization || undefined,
        interests: formData.interests,
        motivation: formData.motivation,
        howDidYouHear: formData.howDidYouHear,
        isVolunteer: formData.isVolunteer,
        volunteerAreas: formData.isVolunteer ? formData.volunteerAreas : undefined,
        status: 'pending',
        submittedAt: new Date(),
        registrationFee: 200,
        monthlyContribution: 100,
        feeAgreement: formData.feeAgreement
      };

      console.log('📝 Submitting membership application:', membershipData);
      const membershipId = await membershipsService.addMembership(membershipData);
      console.log('✅ Membership application submitted successfully with ID:', membershipId);
      
      setPaymentData(paymentData);
      setShowPayment(false);
      setSubmitted(true);
    } catch (error) {
      console.error('❌ Error submitting membership application:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    setShowPayment(false);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'male',
      county: '',
      constituency: '',
      ward: '',
      occupation: '',
      organization: '',
      interests: [],
      motivation: '',
      howDidYouHear: '',
      isVolunteer: false,
      volunteerAreas: [],
      feeAgreement: false
    });
    setShowForm(false);
    setSubmitted(false);
    setShowPayment(false);
    setPaymentData(null);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your interest in joining the United Future Alliance. Your membership application has been received and is under review.
            </p>
            <div className="bg-emerald-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Membership Fees:</strong>
              </p>
              <p className="text-sm text-gray-600">
                • Registration Fee: KES 200 (one-time) ✅ Paid<br/>
                • Monthly Contribution: KES 100 per month
              </p>
              {paymentData && (
                <div className="mt-3 p-3 bg-green-100 rounded-lg">
                  <p className="text-xs text-green-800">
                    <strong>Payment Confirmation:</strong><br/>
                    Receipt: {paymentData.mpesaReceiptNumber}<br/>
                    Amount: KES {paymentData.amount}<br/>
                    Phone: {paymentData.phoneNumber}
                  </p>
                </div>
              )}
            </div>
            <p className="text-gray-500 mb-8">
              We'll review your application and get back to you within 5-7 business days. You'll receive an email confirmation shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('home')}
                className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              >
                Return to Home
              </button>
              <button
                onClick={resetForm}
                className="border-2 border-emerald-500 text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-blue-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join UFA
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Become part of Kenya's most progressive political movement. Together, we'll build a better future for all Kenyans.
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors shadow-lg"
              >
                Start Your Application
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      {!showForm && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Join UFA?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Be part of a movement that's transforming Kenya through progressive policies and inclusive governance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Shape Policy</h3>
                <p className="text-gray-600">Contribute to policy development and have your voice heard in Kenya's future direction.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Community</h3>
                <p className="text-gray-600">Connect with like-minded individuals who share your vision for a better Kenya.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Make Impact</h3>
                <p className="text-gray-600">Participate in initiatives that directly improve lives in your community and across Kenya.</p>
              </div>
            </div>
            
            {/* Membership Fees Section */}
            <div className="mt-16 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Affordable Membership</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Join UFA with our simple and affordable membership structure designed to make political participation accessible to all Kenyans.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                      <CreditCard className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Registration Fee</h4>
                      <p className="text-2xl font-bold text-emerald-600">KES 200</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    One-time registration fee to become a UFA member. This helps cover administrative costs and supports our organizational activities.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Monthly Contribution</h4>
                      <p className="text-2xl font-bold text-blue-600">KES 100</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Monthly contribution to support ongoing UFA activities, community programs, and political initiatives across Kenya.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                  <strong>Total Annual Cost:</strong> KES 1,400 (KES 200 registration + KES 1,200 monthly contributions)
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* M-Pesa Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Registration Payment</h3>
                <p className="text-gray-600">Pay your registration fee to complete your UFA membership application</p>
              </div>
              
              <MpesaPayment
                amount={200}
                accountReference={`UFA-${formData.firstName}-${formData.lastName}`}
                transactionDescription="UFA Membership Registration Fee"
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                onCancel={handlePaymentCancel}
                isDevelopment={true} // Set to false in production
              />
            </div>
          </div>
        </div>
      )}

      {/* Membership Form */}
      {showForm && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Membership Application</h2>
                <p className="text-gray-600">Please fill out the form below to join the United Future Alliance.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-emerald-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                    Location Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">County *</label>
                      <select
                        name="county"
                        value={formData.county}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select County</option>
                        {kenyanCounties.map(county => (
                          <option key={county} value={county}>{county}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Constituency *</label>
                      <input
                        type="text"
                        name="constituency"
                        value={formData.constituency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ward (Optional)</label>
                      <input
                        type="text"
                        name="ward"
                        value={formData.ward}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-emerald-600" />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization (Optional)</label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Interests */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas of Interest</h3>
                  <p className="text-sm text-gray-600 mb-4">Select all areas that interest you:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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

                {/* Motivation */}
                <div className="border-b border-gray-200 pb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to join UFA? *</label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Tell us about your motivation for joining UFA and how you'd like to contribute..."
                    required
                  />
                </div>

                {/* How did you hear about us */}
                <div className="border-b border-gray-200 pb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about UFA? *</label>
                  <select
                    name="howDidYouHear"
                    value={formData.howDidYouHear}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Friend/Family">Friend/Family</option>
                    <option value="Website">Website</option>
                    <option value="Event">Event</option>
                    <option value="News/Media">News/Media</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Volunteer Interest */}
                <div className="pb-6">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="isVolunteer"
                      checked={formData.isVolunteer}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">
                      I'm interested in volunteering with UFA
                    </label>
                  </div>
                  
                  {formData.isVolunteer && (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">Select volunteer areas you're interested in:</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {volunteerAreas.map(area => (
                          <label key={area} className="flex items-center">
                            <input
                              type="checkbox"
                              name={`volunteer_${area}`}
                              checked={formData.volunteerAreas.includes(area)}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{area}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Membership Fee Agreement */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
                    Membership Fees Agreement
                  </h3>
                  
                  <div className="bg-emerald-50 rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600 mb-2">KES 200</div>
                        <div className="text-sm text-gray-600">One-time Registration Fee</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">KES 100</div>
                        <div className="text-sm text-gray-600">Monthly Contribution</div>
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <div className="text-sm text-gray-500">
                        <strong>Total Annual Cost:</strong> KES 1,400
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="feeAgreement"
                      checked={formData.feeAgreement}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-1"
                      required
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      <strong>I agree to pay the membership fees:</strong> KES 200 registration fee (one-time) and KES 100 monthly contribution. 
                      I understand that these fees support UFA's activities and organizational operations. 
                      <span className="text-emerald-600 font-semibold">*</span>
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={submitting || !formData.feeAgreement}
                    className="flex-1 bg-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4" />
                        Pay Registration Fee
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
