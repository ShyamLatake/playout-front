import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Heart,
  Shield,
  HelpCircle,
  FileText,
  Users,
  Calendar,
  Zap
} from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Find Games', path: '/games', icon: Users },
        { label: 'Find Turfs', path: '/turfs', icon: MapPin },
        { label: 'Create Game', path: '/create', icon: Calendar },
        { label: 'List Your Turf', path: '/create-turf', icon: Zap },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '/help', icon: HelpCircle },
        { label: 'Contact Us', path: '/contact', icon: Mail },
        { label: 'Safety Guidelines', path: '/safety', icon: Shield },
        { label: 'Community Rules', path: '/rules', icon: FileText },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about', icon: null },
        { label: 'Careers', path: '/careers', icon: null },
        { label: 'Press', path: '/press', icon: null },
        { label: 'Blog', path: '/blog', icon: null },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/privacy', icon: null },
        { label: 'Terms of Service', path: '/terms', icon: null },
        { label: 'Cookie Policy', path: '/cookies', icon: null },
        { label: 'Refund Policy', path: '/refunds', icon: null },
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/turffinder', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/turffinder', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/turffinder', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/turffinder', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TF</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">TurfFinder</h3>
                <p className="text-sm text-gray-400">Find your game</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Connect with players, discover turfs, and organize games in your area. 
              The ultimate platform for sports enthusiasts.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-primary-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-primary-500" />
                <span>support@turffinder.com</span>
              </div>
            </div>
          </div>

          {/* Footer sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.path}>
                      <button
                        onClick={() => navigate(link.path)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group"
                      >
                        {Icon && <Icon className="w-4 h-4 text-primary-500 group-hover:text-primary-400" />}
                        <span>{link.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-lg font-semibold mb-2">Stay Updated</h4>
              <p className="text-gray-400 text-sm">
                Get the latest updates on new turfs, games, and features.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="btn-primary px-6 py-2 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social links and stats */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Social links */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-gray-300">Follow Us</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600 transition-all duration-200"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Platform stats */}
            <div className="grid grid-cols-3 gap-4 text-center lg:text-right">
              <div>
                <div className="text-2xl font-bold text-primary-500">1.2K+</div>
                <div className="text-xs text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-500">89</div>
                <div className="text-xs text-gray-400">Turfs Listed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-500">2.1K+</div>
                <div className="text-xs text-gray-400">Games Played</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>© {currentYear} TurfFinder. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for sports enthusiasts.</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <button
                onClick={() => navigate('/privacy')}
                className="hover:text-white transition-colors"
              >
                Privacy
              </button>
              <button
                onClick={() => navigate('/terms')}
                className="hover:text-white transition-colors"
              >
                Terms
              </button>
              <button
                onClick={() => navigate('/cookies')}
                className="hover:text-white transition-colors"
              >
                Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;