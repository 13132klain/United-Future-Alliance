import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-red-500 to-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                UFA
              </div>
              <span className="ml-3 text-lg font-bold">United Future Alliance</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Building a unified, progressive, and sustainable future for Kenya through inclusive governance, 
              social justice, and economic empowerment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-red-400">Quick Links</h3>
            <ul className="space-y-3">
              {['About Us', 'Our Mission', 'Leadership', 'Events', 'Get Involved', 'Volunteer'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2">
                    <ExternalLink className="w-3 h-3" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">Resources</h3>
            <ul className="space-y-3">
              {['Policy Papers', 'Research Reports', 'Media Kit', 'FAQ', 'Contact Support', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2">
                    <ExternalLink className="w-3 h-3" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">UFA Headquarters</p>
                  <p className="text-gray-400 text-sm">Nairobi, Kenya</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">+254 xxx xxx xxx</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">info@ufakenya.org</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 United Future Alliance. All rights reserved. Built with 💚 for Kenya's future.
          </p>
        </div>
      </div>
    </footer>
  );
}