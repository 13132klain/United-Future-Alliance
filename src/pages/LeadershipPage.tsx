import React, { useState, useEffect } from 'react';
import { ExternalLink, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Leader } from '../types';
import { leadersService } from '../lib/mockFirestoreService';

export default function LeadershipPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up real-time subscription for leaders
    const unsubscribe = leadersService.subscribeToLeaders((leadersData) => {
      setLeaders(leadersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const mockLeaders: Leader[] = [
    {
      id: '1',
      name: 'Dr. Sarah Mwangi',
      position: 'Chairman & Co-Founder',
      bio: 'Dr. Sarah Mwangi brings over 20 years of experience in public policy and governance. Former UN advisor on sustainable development, she holds a PhD in Public Administration from University of Nairobi and has been a leading voice in Kenya\'s civil society movement.',
      image: 'https://images.pexels.com/photos/3760257/pexels-photo-3760257.jpeg?auto=compress&cs=tinysrgb&w=400',
      socialLinks: {
        twitter: '#',
        linkedin: '#'
      }
    },
    {
      id: '2',
      name: 'James Kipkoech',
      position: 'Executive Director',
      bio: 'James is a seasoned activist and community organizer with 15+ years in grassroots mobilization. A graduate of Harvard Kennedy School, he has led successful advocacy campaigns across East Africa and specializes in youth empowerment initiatives.',
      image: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=400',
      socialLinks: {
        twitter: '#',
        linkedin: '#',
        facebook: '#'
      }
    },
    {
      id: '3',
      name: 'Grace Nyong\'o',
      position: 'Policy Director',
      bio: 'Grace is a policy expert with extensive background in economic development and social justice. She previously worked at the World Bank and Kenya Institute for Public Policy Research and Analysis (KIPPRA), focusing on inclusive growth strategies.',
      image: 'https://images.pexels.com/photos/3760856/pexels-photo-3760856.jpeg?auto=compress&cs=tinysrgb&w=400',
      socialLinks: {
        linkedin: '#'
      }
    },
    {
      id: '4',
      name: 'Dr. Mohamed Hassan',
      position: 'Community Engagement Director',
      bio: 'Dr. Hassan is a community development specialist with deep roots in Northern Kenya. His work focuses on inter-community dialogue, peace building, and inclusive development. He holds a doctorate in Social Anthropology.',
      image: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=400',
      socialLinks: {
        twitter: '#',
        facebook: '#'
      }
    },
    {
      id: '5',
      name: 'Mary Wanjiru',
      position: 'Youth Affairs Coordinator',
      bio: 'Mary is a dynamic young leader who has been at the forefront of youth mobilization in Kenya. A software engineer turned activist, she brings a unique perspective on technology\'s role in democratic participation and social change.',
      image: 'https://images.pexels.com/photos/3760258/pexels-photo-3760258.jpeg?auto=compress&cs=tinysrgb&w=400',
      socialLinks: {
        twitter: '#',
        linkedin: '#'
      }
    },
    {
      id: '6',
      name: 'Prof. David Mutua',
      position: 'Research & Strategy Director',
      bio: 'Professor Mutua is a renowned political scientist and author of several books on African governance. He brings academic rigor and strategic thinking to UFA\'s policy development and long-term planning initiatives.',
      image: 'https://images.pexels.com/photos/3778618/pexels-photo-3778618.jpeg?auto=compress&cs=tinysrgb&w=400',
      socialLinks: {
        linkedin: '#',
        twitter: '#'
      }
    }
  ];

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return Twitter;
      case 'linkedin': return Linkedin;
      case 'facebook': return Facebook;
      default: return ExternalLink;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Our Leadership Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet the dedicated leaders driving Kenya's transformation. Our diverse team brings 
            together decades of experience in governance, policy, community organizing, and social justice.
          </p>
        </div>

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {leaders.map((leader) => (
            <div key={leader.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Leader Photo */}
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={leader.image} 
                  alt={leader.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Leader Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {leader.name}
                </h3>
                <p className="text-emerald-600 font-semibold mb-4">
                  {leader.position}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4">
                  {leader.bio}
                </p>

                {/* Social Links */}
                <div className="flex gap-3">
                  {Object.entries(leader.socialLinks).map(([platform, url]) => {
                    const SocialIcon = getSocialIcon(platform);
                    return (
                      <a
                        key={platform}
                        href={url}
                        className="w-8 h-8 bg-gray-100 hover:bg-emerald-500 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all duration-200"
                        aria-label={`${leader.name} on ${platform}`}
                      >
                        <SocialIcon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Board Section */}
        <section className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 mb-16 border border-emerald-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advisory Board
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our advisory board consists of distinguished Kenyans from various sectors 
              who provide strategic guidance and expertise to our movement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Hon. Catherine Murungi',
                title: 'Former Chief Justice',
                expertise: 'Constitutional Law & Governance'
              },
              {
                name: 'Dr. Patrick Lumumba',
                title: 'Constitutional Expert',
                expertise: 'Pan-African Law & Policy'
              },
              {
                name: 'Wangari Maathai Foundation',
                title: 'Environmental Partner',
                expertise: 'Environmental Conservation'
              },
              {
                name: 'James Mwangi',
                title: 'Banking Executive',
                expertise: 'Economic Development'
              },
              {
                name: 'Dr. Shikuku Obwaka',
                title: 'Education Reformer',
                expertise: 'Education Policy'
              },
              {
                name: 'Lupita Nyong\'o',
                title: 'Cultural Ambassador',
                expertise: 'Arts & Cultural Development'
              }
            ].map((advisor, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-1">{advisor.name}</h4>
                <p className="text-emerald-600 text-sm mb-2">{advisor.title}</p>
                <p className="text-gray-600 text-xs">{advisor.expertise}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Join Leadership CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white p-12 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Lead with Us?
            </h2>
            <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
              UFA is always looking for passionate leaders to join our team at various levels. 
              If you share our vision for Kenya's future, we want to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors shadow-lg">
                Apply for Leadership
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-emerald-700 transition-colors">
                Volunteer with Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}