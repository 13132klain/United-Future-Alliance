import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle, 
  ArrowRight,
  Users,
  Target,
  Calendar,
  MapPin,
  Shield,
  Star,
  TrendingUp,
  Award,
  Gift
} from 'lucide-react';
import { DonationCampaign, Donation } from '../types';
import { campaignsService, donationsService } from '../lib/mockFirestoreService';

export default function DonationPage() {
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>([]);
  const [featuredCampaigns, setFeaturedCampaigns] = useState<DonationCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationForm, setDonationForm] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    isAnonymous: false,
    message: '',
    paymentMethod: 'mobile_money' as 'card' | 'mobile_money' | 'bank_transfer'
  });
  const [processing, setProcessing] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    // Set up real-time subscriptions for campaigns
    const unsubscribeCampaigns = campaignsService.subscribeToCampaigns((campaignsData) => {
      setCampaigns(campaignsData);
      setLoading(false);
    });

    const unsubscribeFeatured = campaignsService.subscribeToCampaigns((campaignsData) => {
      setFeaturedCampaigns(campaignsData.filter(c => c.featured && c.isActive));
    });

    return () => {
      unsubscribeCampaigns();
      unsubscribeFeatured();
    };
  }, []);

  const presetAmounts = [500, 1000, 2500, 5000, 10000, 25000];

  const openDonationModal = (campaign: DonationCampaign) => {
    setSelectedCampaign(campaign);
    setShowDonationModal(true);
    setDonationSuccess(false);
  };

  const closeDonationModal = () => {
    setShowDonationModal(false);
    setSelectedCampaign(null);
    setDonationAmount(0);
    setCustomAmount('');
    setDonationForm({
      donorName: '',
      donorEmail: '',
      donorPhone: '',
      isAnonymous: false,
      message: '',
      paymentMethod: 'mobile_money'
    });
    setDonationSuccess(false);
  };

  const handleAmountSelect = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount > 0) {
      setDonationAmount(amount);
    }
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign || donationAmount <= 0) return;

    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const donationData: Omit<Donation, 'id'> = {
        amount: donationAmount,
        currency: 'KES',
        donorName: donationForm.isAnonymous ? 'Anonymous' : donationForm.donorName,
        donorEmail: donationForm.donorEmail,
        donorPhone: donationForm.donorPhone,
        isAnonymous: donationForm.isAnonymous,
        campaign: selectedCampaign.title,
        message: donationForm.message,
        paymentMethod: donationForm.paymentMethod,
        status: 'completed',
        transactionId: `TXN_${Date.now()}`,
        createdAt: new Date(),
        processedAt: new Date()
      };

      await donationsService.addDonation(donationData);
      
      // Update campaign amount
      await campaignsService.updateCampaignAmount(selectedCampaign.id, donationAmount);
      
      setDonationSuccess(true);
    } catch (error) {
      console.error('Error processing donation:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'education': return Users;
      case 'healthcare': return Heart;
      case 'infrastructure': return Building2;
      case 'emergency': return Shield;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'education': return 'bg-blue-100 text-blue-800';
      case 'healthcare': return 'bg-red-100 text-red-800';
      case 'infrastructure': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Support Our Mission
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-3xl mx-auto">
              Join us in building a better Kenya. Your donation helps us create lasting change in education, healthcare, infrastructure, and community development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('campaigns')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
              >
                View Campaigns
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
              >
                See Our Impact
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Together, we're making a real difference in communities across Kenya
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">15,000+</h3>
              <p className="text-gray-600">Lives Impacted</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">25</h3>
              <p className="text-gray-600">Counties Reached</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">98%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Campaigns
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Support our most impactful initiatives that are transforming communities across Kenya
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              <p className="mt-4 text-gray-600">Loading campaigns...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredCampaigns.map((campaign) => {
                const CategoryIcon = getCategoryIcon(campaign.category);
                const progressPercentage = getProgressPercentage(campaign.currentAmount, campaign.targetAmount);
                
                return (
                  <div key={campaign.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-48">
                      <img 
                        src={campaign.image} 
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getCategoryColor(campaign.category)}`}>
                          {campaign.category}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <CategoryIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>{formatCurrency(campaign.currentAmount)} raised</span>
                          <span>Goal: {formatCurrency(campaign.targetAmount)}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => openDonationModal(campaign)}
                        className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Heart className="w-4 h-4" />
                        Donate Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* All Campaigns */}
      <section id="campaigns" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Campaigns
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore all our active campaigns and find the cause that resonates with you
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              <p className="mt-4 text-gray-600">Loading campaigns...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.filter(c => c.isActive).map((campaign) => {
                const CategoryIcon = getCategoryIcon(campaign.category);
                const progressPercentage = getProgressPercentage(campaign.currentAmount, campaign.targetAmount);
                
                return (
                  <div key={campaign.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                    <div className="relative h-40">
                      <img 
                        src={campaign.image} 
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getCategoryColor(campaign.category)}`}>
                          {campaign.category}
                        </span>
                      </div>
                      {campaign.featured && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Star className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{campaign.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{campaign.description}</p>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>{formatCurrency(campaign.currentAmount)}</span>
                          <span>{formatCurrency(campaign.targetAmount)}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => openDonationModal(campaign)}
                        className="w-full bg-emerald-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
                      >
                        <Heart className="w-3 h-3" />
                        Donate
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Donate to UFA?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your contribution makes a real difference in building a better Kenya
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparent & Accountable</h3>
              <p className="text-gray-600">We provide detailed reports on how your donations are used and the impact they create.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Impact</h3>
              <p className="text-gray-600">Our programs have a 98% success rate with measurable outcomes in education, healthcare, and infrastructure.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tax Deductible</h3>
              <p className="text-gray-600">All donations are tax-deductible and you'll receive a receipt for your records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Modal */}
      {showDonationModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {donationSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-6">
                  Your donation of {formatCurrency(donationAmount)} to "{selectedCampaign.title}" has been processed successfully.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  You will receive a confirmation email shortly with your receipt and tax deduction information.
                </p>
                <button
                  onClick={closeDonationModal}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Donate to {selectedCampaign.title}</h3>
                  <button
                    onClick={closeDonationModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleDonationSubmit} className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Amount (KES)</label>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {presetAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleAmountSelect(amount)}
                          className={`p-3 rounded-lg border-2 font-semibold transition-colors ${
                            donationAmount === amount
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-300 hover:border-emerald-300'
                          }`}
                        >
                          {formatCurrency(amount)}
                        </button>
                      ))}
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => handleCustomAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Donor Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={donationForm.donorName}
                        onChange={(e) => setDonationForm({ ...donationForm, donorName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={donationForm.donorEmail}
                        onChange={(e) => setDonationForm({ ...donationForm, donorEmail: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={donationForm.donorPhone}
                      onChange={(e) => setDonationForm({ ...donationForm, donorPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                    <textarea
                      value={donationForm.message}
                      onChange={(e) => setDonationForm({ ...donationForm, message: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Share why you're supporting this cause..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={donationForm.isAnonymous}
                      onChange={(e) => setDonationForm({ ...donationForm, isAnonymous: e.target.checked })}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                      Make this donation anonymous
                    </label>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="mobile_money"
                          checked={donationForm.paymentMethod === 'mobile_money'}
                          onChange={(e) => setDonationForm({ ...donationForm, paymentMethod: e.target.value as any })}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        />
                        <Smartphone className="w-5 h-5 text-gray-400 ml-3" />
                        <span className="ml-2 text-sm font-medium text-gray-700">Mobile Money</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={donationForm.paymentMethod === 'card'}
                          onChange={(e) => setDonationForm({ ...donationForm, paymentMethod: e.target.value as any })}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        />
                        <CreditCard className="w-5 h-5 text-gray-400 ml-3" />
                        <span className="ml-2 text-sm font-medium text-gray-700">Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank_transfer"
                          checked={donationForm.paymentMethod === 'bank_transfer'}
                          onChange={(e) => setDonationForm({ ...donationForm, paymentMethod: e.target.value as any })}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        />
                        <Building2 className="w-5 h-5 text-gray-400 ml-3" />
                        <span className="ml-2 text-sm font-medium text-gray-700">Bank Transfer</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={processing || donationAmount <= 0}
                      className="flex-1 bg-emerald-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4" />
                          Donate {formatCurrency(donationAmount)}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={closeDonationModal}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
