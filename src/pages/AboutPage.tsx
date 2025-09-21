import React from 'react';
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink,
  CheckCircle,
  TrendingUp,
  Globe,
  Shield,
  Lightbulb,
  Handshake
} from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Transparency',
      description: 'We believe in open, honest communication and accountability in all our actions and decisions.'
    },
    {
      icon: Users,
      title: 'Inclusivity',
      description: 'Every Kenyan voice matters. We create spaces where all communities can participate and thrive.'
    },
    {
      icon: Heart,
      title: 'Social Justice',
      description: 'We fight for equality, fairness, and the protection of human rights for all Kenyans.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace new ideas and technologies to solve Kenya\'s challenges creatively and effectively.'
    },
    {
      icon: Handshake,
      title: 'Collaboration',
      description: 'We work together with communities, organizations, and individuals to achieve common goals.'
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description: 'We build solutions that protect our environment and ensure prosperity for future generations.'
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'UFA Founded',
      description: 'United Future Alliance officially launched with a vision for a progressive Kenya.',
      icon: Calendar
    },
    {
      year: '2024',
      title: 'First National Convention',
      description: 'Brought together leaders from all 47 counties to establish our foundation.',
      icon: Users
    },
    {
      year: '2024',
      title: 'Community Programs Launch',
      description: 'Initiated grassroots programs in education, healthcare, and economic development.',
      icon: Target
    },
    {
      year: '2024',
      title: 'Digital Platform Launch',
      description: 'Launched our comprehensive digital platform for citizen engagement and participation.',
      icon: Globe
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Members', icon: Users },
    { number: '47', label: 'Counties Reached', icon: MapPin },
    { number: '150+', label: 'Community Programs', icon: Target },
    { number: '25,000+', label: 'Lives Impacted', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              <span className="marker-highlight">About United Future Alliance</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-100 max-w-4xl mx-auto leading-relaxed">
              Building a unified, progressive, and sustainable future for Kenya through inclusive governance, 
              social justice, and economic empowerment.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                <span className="marker-highlight">Our Story</span>
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  The United Future Alliance was founded in 2024 by a diverse group of Kenyan leaders, activists, 
                  and citizens who shared a common vision: to build a more inclusive, progressive, and sustainable 
                  Kenya for all.
                </p>
                <p>
                  Born from the recognition that Kenya's challenges require innovative, collaborative solutions, 
                  UFA emerged as a movement that transcends traditional political boundaries. We believe that 
                  through unity, innovation, and collective action, we can address the systemic issues facing 
                  our nation.
                </p>
                <p>
                  Our movement is built on the principles of transparency, accountability, and citizen participation 
                  in governance. We are committed to creating opportunities for every Kenyan to thrive, regardless 
                  of their background, location, or circumstances.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <stat.icon className="w-8 h-8 text-red-600 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              <span className="marker-highlight">Our Foundation</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles and aspirations that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To unite Kenyans across all communities in building a progressive, inclusive, and sustainable 
                future through innovative governance, social justice, and economic empowerment.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                A Kenya where every citizen has equal opportunities to thrive, where communities are empowered 
                to shape their own futures, and where progressive values drive sustainable development.
              </p>
            </div>

            {/* Purpose */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Purpose</h3>
              <p className="text-gray-600 leading-relaxed">
                To create lasting positive change by fostering unity, promoting transparency, and empowering 
                communities to participate actively in shaping Kenya's future.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              <span className="marker-highlight">Our Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our mission to transform Kenya
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-500 to-blue-500 rounded-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <milestone.icon className="w-6 h-6 text-red-600" />
                        <span className="text-2xl font-bold text-red-600">{milestone.year}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-red-500 rounded-full z-10"></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="marker-highlight">Our Impact</span>
            </h2>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              Measurable change across Kenya's communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <TrendingUp className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">85%</div>
                <div className="text-gray-100">Program Success Rate</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-gray-100">Community Leaders Trained</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">15</div>
                <div className="text-gray-100">Awards & Recognition</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <Globe className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-gray-100">Digital Accessibility</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              <span className="marker-highlight">Get in Touch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to join our movement? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">info@ufa.org</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Phone</div>
                    <div className="text-gray-600">+254 700 000 000</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Address</div>
                    <div className="text-gray-600">Nairobi, Kenya</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Join Our Movement</h3>
              <div className="space-y-4">
                <a
                  href="#"
                  className="flex items-center justify-between p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <span className="font-semibold">Become a Member</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span className="font-semibold">Volunteer with Us</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span className="font-semibold">Support Our Cause</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
