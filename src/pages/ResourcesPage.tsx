import React from 'react';
import { FileText, Video, BookOpen, Download, ExternalLink, Search } from 'lucide-react';
import { Resource } from '../types';

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Kenya 2030 Vision: UFA Policy Framework',
      description: 'Comprehensive policy document outlining UFA\'s strategic approach to achieving sustainable development goals by 2030.',
      type: 'document',
      url: '#',
      category: 'Policy',
      publishDate: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Youth Unemployment Solutions - Research Report',
      description: 'In-depth analysis of youth unemployment challenges in Kenya with practical solutions and implementation strategies.',
      type: 'report',
      url: '#',
      category: 'Research',
      publishDate: new Date('2024-01-10')
    },
    {
      id: '3',
      title: 'Community Organizing Toolkit',
      description: 'Step-by-step guide for grassroots organizers looking to mobilize their communities for positive change.',
      type: 'document',
      url: '#',
      category: 'Organizing',
      publishDate: new Date('2024-01-08')
    },
    {
      id: '4',
      title: 'Understanding Kenya\'s Constitution - Video Series',
      description: 'Educational video series breaking down key constitutional provisions and citizen rights in accessible language.',
      type: 'video',
      url: '#',
      category: 'Education',
      publishDate: new Date('2024-01-05')
    },
    {
      id: '5',
      title: 'Climate Action Plan for Kenya',
      description: 'UFA\'s comprehensive strategy for addressing climate change impacts and promoting environmental sustainability.',
      type: 'document',
      url: '#',
      category: 'Environment',
      publishDate: new Date('2024-01-03')
    },
    {
      id: '6',
      title: 'Women in Leadership: Breaking Barriers',
      description: 'Research article examining challenges faced by women in political leadership and pathways for improvement.',
      type: 'article',
      url: '#',
      category: 'Gender',
      publishDate: new Date('2023-12-28')
    }
  ];

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'Policy', label: 'Policy Papers' },
    { id: 'Research', label: 'Research Reports' },
    { id: 'Education', label: 'Educational Content' },
    { id: 'Organizing', label: 'Organizing Tools' },
    { id: 'Environment', label: 'Environmental' },
    { id: 'Gender', label: 'Gender & Equality' }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'video': return Video;
      case 'article': return BookOpen;
      case 'report': return FileText;
      default: return FileText;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-600';
      case 'video': return 'bg-red-100 text-red-600';
      case 'article': return 'bg-green-100 text-green-600';
      case 'report': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Resources & Learning Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access our comprehensive collection of policy papers, research reports, educational materials, 
            and organizing tools to stay informed and engaged.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredResources.map((resource) => {
            const ResourceIcon = getResourceIcon(resource.type);
            return (
              <div key={resource.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  {/* Resource Type Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getResourceColor(resource.type)}`}>
                      <ResourceIcon className="w-6 h-6" />
                    </div>
                    <span className="text-sm text-gray-500 capitalize bg-gray-100 px-3 py-1 rounded-full">
                      {resource.category}
                    </span>
                  </div>

                  {/* Resource Title & Description */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  {/* Publish Date */}
                  <p className="text-sm text-gray-500 mb-6">
                    Published: {resource.publishDate.toLocaleDateString('en-US', { 
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-emerald-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button className="border-2 border-emerald-500 text-emerald-600 p-3 rounded-lg hover:bg-emerald-50 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filters.</p>
          </div>
        )}

        {/* Educational Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Civic Education */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Civic Education Hub</h2>
            <p className="text-gray-600 mb-6">
              Learn about your rights, responsibilities, and how to participate effectively in Kenya's democracy.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Understanding the Constitution
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Voter Education Materials
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Citizen Participation Guides
              </li>
            </ul>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Explore Civic Education
            </button>
          </div>

          {/* Research Library */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-2xl border border-emerald-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Research Library</h2>
            <p className="text-gray-600 mb-6">
              Access in-depth research on Kenya's development challenges and evidence-based solutions.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Economic Development Studies
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Social Policy Research
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Environmental Impact Reports
              </li>
            </ul>
            <button className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors">
              Browse Research
            </button>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white p-12 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest resources, research, and educational materials 
            delivered directly to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
            <button className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}