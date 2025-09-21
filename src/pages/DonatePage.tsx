import React from 'react';
import { Heart, Shield, Users, Target, CreditCard, Banknote, Smartphone, CheckCircle } from 'lucide-react';

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = React.useState<number>(0);
  const [customAmount, setCustomAmount] = React.useState<string>('');
  const [donationType, setDonationType] = React.useState<'one-time' | 'monthly'>('one-time');
  const [paymentMethod, setPaymentMethod] = React.useState<'card' | 'mpesa'>('mpesa');

  const predefinedAmounts = [500, 1000, 2500, 5000, 10000, 25000];

  const causes = [
    {
      id: 'education',
      title: 'Education Reform Initiative',
      description: 'Supporting digital literacy and vocational training programs',
      raised: 2500000,
      target: 5000000,
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      id: 'youth',
      title: 'Youth Employment Program',
      description: 'Creating sustainable career opportunities for young Kenyans',
      raised: 1800000,
      target: 3000000,
      icon: Users,
      color: 'bg-emerald-500'
    },
    {
      id: 'community',
      title: 'Community Development Fund',
      description: 'Grassroots projects for local infrastructure and services',
      raised: 800000,
      target: 2000000,
      icon: Heart,
      color: 'bg-purple-500'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(0);
  };

  const getCurrentAmount = () => {
    return customAmount ? parseInt(customAmount) : selectedAmount;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mb-6 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            <span className="marker-highlight">Support Kenya's Future</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your contribution helps fund critical initiatives that are building a more 
            progressive, inclusive, and sustainable Kenya for all citizens.
          </p>
        </div>

        {/* Active Campaigns */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center"><span className="marker-highlight">Active Campaigns</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {causes.map((cause) => (
              <div key={cause.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className={`h-2 ${cause.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 ${cause.color} rounded-full flex items-center justify-center`}>
                      <cause.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{cause.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{cause.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Raised: {formatCurrency(cause.raised)}</span>
                      <span>Goal: {formatCurrency(cause.target)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 ${cause.color} rounded-full transition-all duration-300`}
                        style={{ width: `${getProgressPercentage(cause.raised, cause.target)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {getProgressPercentage(cause.raised, cause.target).toFixed(1)}% of goal reached
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donation Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center"><span className="marker-highlight">Make Your Contribution</span></h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Donation Options */}
            <div>
              {/* Donation Type */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDonationType('one-time')}
                    className={`p-4 border-2 rounded-lg font-medium transition-all ${
                      donationType === 'one-time'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    One-time
                  </button>
                  <button
                    onClick={() => setDonationType('monthly')}
                    className={`p-4 border-2 rounded-lg font-medium transition-all ${
                      donationType === 'monthly'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Amount (KSh)</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-3 border-2 rounded-lg font-medium transition-all ${
                        selectedAmount === amount
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Amount
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter custom amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'mpesa')}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <Smartphone className="w-6 h-6 text-green-600" />
                    <span className="font-medium">M-PESA</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'mpesa')}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <span className="font-medium">Credit/Debit Card</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Summary & Security */}
            <div>
              {/* Donation Summary */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-100 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">
                      {getCurrentAmount() > 0 ? formatCurrency(getCurrentAmount()) : 'Select amount'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold capitalize">{donationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-semibold">{paymentMethod === 'mpesa' ? 'M-PESA' : 'Card'}</span>
                  </div>
                  <hr className="border-emerald-200" />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-emerald-600">
                      {getCurrentAmount() > 0 ? formatCurrency(getCurrentAmount()) : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="bg-gray-50 p-6 rounded-xl mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  Secure Donation
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    SSL encrypted payment processing
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    PCI DSS compliant security
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Instant donation receipt
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Full transparency reporting
                  </div>
                </div>
              </div>

              {/* Donate Button */}
              <button
                disabled={getCurrentAmount() <= 0}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                {getCurrentAmount() > 0 
                  ? `Donate ${formatCurrency(getCurrentAmount())}` 
                  : 'Select Amount to Continue'
                }
              </button>
            </div>
          </div>
        </div>

        {/* Impact Statement */}
        <div className="mt-12 text-center bg-gradient-to-br from-emerald-600 to-green-700 text-white p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6"><span className="marker-highlight">Your Impact Matters</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-bold mb-2">KSh 500</div>
              <p className="text-emerald-100">Can provide educational materials for 5 students</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">KSh 2,500</div>
              <p className="text-emerald-100">Can fund a youth skills training workshop</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">KSh 10,000</div>
              <p className="text-emerald-100">Can support a community development project</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}