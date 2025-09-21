import { useState, useEffect } from 'react';
import { ExternalLink, Twitter, Linkedin, Facebook, Loader2 } from 'lucide-react';
import { Leader } from '../types';
import { leadersService } from '../lib/firestoreServices';
import { indexedDBFileStorageService } from '../lib/indexedDBFileStorageService';

// Component to handle async image loading from IndexedDB
const LeaderImage: React.FC<{ 
  imageValue: string; 
  alt: string; 
  className: string;
  fallbackInitials: string;
}> = ({ imageValue, alt, className, fallbackInitials }) => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (!imageValue) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);

        // If it's already a blob URL, use it directly
        if (imageValue.startsWith('blob:')) {
          setImageURL(imageValue);
          setLoading(false);
          return;
        }

        // If it's a fileId, generate a new blob URL
        if (imageValue.startsWith('file_')) {
          const url = await indexedDBFileStorageService.getImageURL(imageValue);
          setImageURL(url);
        } else {
          // For other cases (like external URLs), use as is
          setImageURL(imageValue);
        }
      } catch (err) {
        console.error('Failed to load image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [imageValue]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error || !imageURL) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center`}>
        <span className="text-white font-bold text-3xl">
          {fallbackInitials}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={imageURL} 
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default function LeadershipPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    // Set up real-time subscription for leaders
    const unsubscribe = leadersService.subscribeToLeaders((leadersData) => {
      setLeaders(leadersData);
    });

    return () => unsubscribe();
  }, []);


  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return Twitter;
      case 'linkedin': return Linkedin;
      case 'facebook': return Facebook;
      default: return ExternalLink;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            <span className="marker-highlight">Our Leadership Team</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet the dedicated leaders driving Kenya's transformation. Our diverse team brings 
            together decades of experience in governance, policy, community organizing, and social justice.
          </p>
        </div>

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {leaders.map((leader) => (
            <div key={leader.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {/* Full Background Image */}
              <LeaderImage 
                imageValue={leader.image || ''}
                alt={leader.name}
                className="w-full h-56 object-cover"
                fallbackInitials={getInitials(leader.name)}
              />
              
              {/* Card Content */}
              <div className="p-4">
                {/* Name and Status */}
                <div className="text-center mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{leader.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Active Leader</span>
                  </div>
                </div>
                
                {/* Position */}
                <div className="text-center mb-3">
                  <p className="text-sm font-medium text-gray-700">{leader.position}</p>
                </div>
                
                {/* Bio */}
                {leader.bio && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 text-center">
                      {leader.bio}
                    </p>
                  </div>
                )}
                
                {/* Social Links */}
                <div className="flex items-center justify-center space-x-3">
                  {leader.socialLinks && Object.entries(leader.socialLinks).map(([platform, url]) => {
                    const SocialIcon = getSocialIcon(platform);
                    return (
                      <a
                        key={platform}
                        href={url}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200"
                        aria-label={`${leader.name} on ${platform}`}
                      >
                        <SocialIcon className="w-4 h-4 text-gray-600" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Board Section */}
        <section className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 mb-16 border border-blue-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              <span className="marker-highlight">Advisory Board</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our advisory board consists of distinguished Kenyans from various sectors 
              who provide strategic guidance and expertise to our movement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
                <div className="text-center">
                  <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-1">{advisor.name}</h4>
                  <p className="text-gray-700 text-xs mb-2 line-clamp-1 font-semibold">{advisor.title}</p>
                  <p className="text-gray-600 text-xs line-clamp-2">{advisor.expertise}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Join Leadership CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-red-600 to-blue-700 text-white p-12 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">
              <span className="marker-highlight">Ready to Lead with Us?</span>
            </h2>
            <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
              UFA is always looking for passionate leaders to join our team at various levels. 
              If you share our vision for Kenya's future, we want to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors shadow-lg">
                Apply for Leadership
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-red-700 transition-colors">
                Volunteer with Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}