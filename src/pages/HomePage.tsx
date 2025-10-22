import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';

import { format } from 'date-fns';
import {
  Activity,
  Zap,
  MapPin,
  Clock,
  Users,
  Plus,
  Search,
  Calendar,
  ArrowRight,
  Play,
  Shield,
  Smartphone,
  Award,
  Target,
  ChevronRight,
  Heart,
  Sparkles,
  Globe,
  Gamepad2,
  Trophy,
  UserCheck
} from 'lucide-react';
import GameCard from '../components/GameCard';

const HomePage: React.FC = () => {
  const { user } = useUser();
  const { games } = useGame();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredGames = games.filter(game =>
    new Date(game.date) > new Date() && game.status === 'open'
  ).slice(0, 3);

  const upcomingGames = games.filter(game =>
    new Date(game.date) > new Date()
  ).slice(0, 4);

  const todaysGames = games.filter(game => {
    const today = new Date();
    const gameDate = new Date(game.date);
    return gameDate.toDateString() === today.toDateString();
  });



  const connections = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Build Friendships",
      description: "Connect with like-minded sports enthusiasts and build lasting friendships through shared passion",
      color: "from-red-400 to-pink-500"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Compete & Win",
      description: "Join competitive matches, improve your skills, and celebrate victories with your team",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Expand Network",
      description: "Meet players from different backgrounds and expand your sports network across the city",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Create Memories",
      description: "Every game is a new adventure. Create unforgettable memories on the field",
      color: "from-purple-400 to-pink-500"
    }
  ];

  const features = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Easy Booking",
      description: "Book turfs and join games with just a few taps"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Players",
      description: "Play with trusted and verified community members"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Premium Turfs",
      description: "Access to the best sports facilities in your city"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Perfect Matches",
      description: "Find games that match your skill level and preferences"
    }
  ];

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'cricket':
        return <Activity className="w-5 h-5 text-cricket-600" />;
      case 'football':
        return <Zap className="w-5 h-5 text-football-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'cricket':
        return 'bg-cricket-100 text-cricket-800';
      case 'football':
        return 'bg-football-100 text-football-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-turf-500 via-turf-600 to-primary-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 transform hover:scale-105 transition-transform duration-1000" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className={`relative px-4 py-16 md:py-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-6xl mx-auto text-center">


            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="inline-block transform hover:scale-105 transition-transform duration-300">Find Your Perfect</span>
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent transform hover:scale-110 transition-transform duration-300 inline-block">
                Game
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-turf-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with passionate players, book premium turfs, and experience the thrill of competitive sports in your city
            </p>

            {/* Animated Stats */}
            <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
              <div className={`text-center transform hover:scale-110 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '300ms' }}>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  0+
                </div>
                <div className="text-turf-100 font-medium">Active Games</div>
              </div>
              <div className={`text-center transform hover:scale-110 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  0+
                </div>
                <div className="text-turf-100 font-medium">Players</div>
              </div>
              <div className={`text-center transform hover:scale-110 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: '500ms' }}>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  0+
                </div>
                <div className="text-turf-100 font-medium">Premium Turfs</div>
              </div>
            </div>

            {/* CTA Buttons */}
            {!user ? (
              <div className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
                <button
                  onClick={() => navigate('/register')}
                  className="group bg-white text-turf-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/games')}
                  className="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-turf-600 px-10 py-4 text-lg font-semibold rounded-2xl backdrop-blur-sm hover:backdrop-blur-none transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Play className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Explore Games
                </button>
              </div>
            ) : (
              <div className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
                <button
                  onClick={() => navigate('/create')}
                  className="group bg-white text-turf-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Create Game
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/games')}
                  className="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-turf-600 px-10 py-4 text-lg font-semibold rounded-2xl backdrop-blur-sm hover:backdrop-blur-none transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Find Games
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Subtle Geometric Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-white/10 rounded-2xl rotate-12 transform hover:rotate-45 transition-transform duration-1000" />
        <div className="absolute top-40 right-20 w-24 h-24 border border-yellow-300/20 rounded-full transform hover:scale-110 transition-transform duration-1000" />
        <div className="absolute bottom-20 left-20 w-20 h-20 border border-orange-300/20 rounded-lg rotate-45 transform hover:rotate-90 transition-transform duration-1000" />

        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 w-full h-20 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-r from-white/5 to-transparent transform -skew-y-1" />
        </div>
      </div>

      {/* Sports Showcase Section */}
      <div className="px-4 py-16 bg-gradient-to-r from-turf-50 to-primary-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Popular Sports</h2>
            <p className="text-lg text-gray-600">Choose from a variety of sports and find your perfect match</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { emoji: '🏏', name: 'Cricket', color: 'from-green-400 to-green-600' },
              { emoji: '⚽', name: 'Football', color: 'from-blue-400 to-blue-600' },
              { emoji: '🏸', name: 'Badminton', color: 'from-purple-400 to-purple-600' },
              { emoji: '🏐', name: 'Volleyball', color: 'from-orange-400 to-orange-600' },
              { emoji: '🏀', name: 'Basketball', color: 'from-red-400 to-red-600' },
              { emoji: '🎾', name: 'Tennis', color: 'from-yellow-400 to-yellow-600' }
            ].map((sport, index) => (
              <div 
                key={sport.name}
                className={`group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  transform: `translateY(${Math.sin((scrollY + index * 150) * 0.01) * 3}px)`
                }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${sport.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                  <div className="text-2xl">
                    {sport.emoji}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 text-center group-hover:text-turf-600 transition-colors">
                  {sport.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
        {/* Floating Elements */}
        <div
          className="absolute top-20 right-20 w-32 h-32 bg-turf-100 rounded-full opacity-20"
          style={{ transform: `translateY(${scrollY * 0.05}px) rotate(${scrollY * 0.1}deg)` }}
        />
        <div
          className="absolute bottom-20 left-20 w-24 h-24 bg-primary-100 rounded-lg opacity-20"
          style={{ transform: `translateY(${-scrollY * 0.08}px) rotate(${-scrollY * 0.1}deg)` }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-turf-100 rounded-full px-6 py-3 mb-6">
              <UserCheck className="w-5 h-5 text-turf-600" />
              <span className="text-turf-700 font-medium">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Built for <span className="bg-gradient-to-r from-turf-600 to-primary-600 bg-clip-text text-transparent">Players</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of sports community with our cutting-edge platform designed for passionate players
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group text-center p-8 rounded-3xl bg-white border border-gray-100 hover:shadow-2xl hover:border-turf-200 transition-all duration-700 transform hover:-translate-y-4 hover:rotate-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  transform: `translateY(${Math.sin((scrollY + index * 200) * 0.01) * 5}px)`
                }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-turf-400 to-turf-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-125 group-hover:shadow-xl group-hover:shadow-turf-300/50 group-hover:rotate-12 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-turf-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-turf-400 to-primary-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {user && (
        <div className="px-4 py-12 bg-gradient-to-r from-turf-50 to-primary-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {user?.userType === 'turf_owner' ? (
                <>
                  <button
                    onClick={() => navigate('/turf-dashboard')}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Dashboard</span>
                  </button>
                  <button
                    onClick={() => navigate('/create-turf')}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-turf-400 to-turf-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Add Turf</span>
                  </button>
                  <button
                    onClick={() => navigate('/games')}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-cricket-400 to-cricket-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">View Games</span>
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-football-400 to-football-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">My Profile</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/my-dashboard')}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">My Dashboard</span>
                  </button>
                  <button
                    onClick={() => navigate('/games')}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-turf-400 to-turf-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Search className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Find Games</span>
                  </button>
                  <button
                    onClick={() => navigate('/turfs')}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-cricket-400 to-cricket-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Book Turfs</span>
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-football-400 to-football-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">My Profile</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Connect & Play Section */}
      <div className="px-4 py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div
            className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-turf-500/20 to-primary-500/20 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-primary-500/20 to-turf-500/20 rounded-full blur-3xl"
            style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Gamepad2 className="w-5 h-5 text-turf-300" />
              <span className="text-turf-100 font-medium">Connect & Play</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-turf-100 to-primary-100 bg-clip-text text-transparent">
              More Than Just Games
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join a vibrant community where every match is an opportunity to connect, compete, and create lasting memories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {connections.map((connection, index) => (
              <div
                key={index}
                className={`group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-700 transform hover:-translate-y-2 hover:scale-105`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  transform: `translateY(${Math.sin((scrollY + index * 100) * 0.01) * 10}px)`
                }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${connection.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {connection.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-turf-200 transition-colors">
                  {connection.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                  {connection.description}
                </p>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${connection.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
              </div>
            ))}
          </div>

          {/* Community Stats */}
          <div className="text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-turf-300 to-primary-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  0+
                </div>
                <div className="text-gray-400 group-hover:text-gray-300 transition-colors">Active Players</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary-300 to-turf-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  0+
                </div>
                <div className="text-gray-400 group-hover:text-gray-300 transition-colors">Games Played</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-turf-300 to-primary-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  0+
                </div>
                <div className="text-gray-400 group-hover:text-gray-300 transition-colors">Partner Turfs</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary-300 to-turf-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  0%
                </div>
                <div className="text-gray-400 group-hover:text-gray-300 transition-colors">Happy Players</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sports Action Section */}
      <div className="px-4 py-16 bg-gradient-to-br from-gray-100 to-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Experience the <span className="text-turf-600">Action</span>
            </h2>
            <p className="text-lg text-gray-600">Join the excitement of competitive sports</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                emoji: '🏏', 
                title: 'Cricket Matches', 
                description: 'Join exciting cricket games with players of all skill levels',
                bgColor: 'from-green-100 to-green-200',
                textColor: 'text-green-800'
              },
              { 
                emoji: '⚽', 
                title: 'Football Games', 
                description: 'Experience the thrill of football with passionate players',
                bgColor: 'from-blue-100 to-blue-200',
                textColor: 'text-blue-800'
              },
              { 
                emoji: '🏸', 
                title: 'Badminton Courts', 
                description: 'Find partners for competitive badminton matches',
                bgColor: 'from-purple-100 to-purple-200',
                textColor: 'text-purple-800'
              }
            ].map((item, index) => (
              <div 
                key={item.title}
                className={`group bg-gradient-to-br ${item.bgColor} rounded-3xl p-8 hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ 
                  transitionDelay: `${index * 200}ms`,
                  transform: `translateY(${Math.sin((scrollY + index * 200) * 0.008) * 5}px)`
                }}
              >
                <div className="text-center">
                  <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500">
                    {item.emoji}
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${item.textColor} group-hover:scale-105 transition-transform duration-300`}>
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Games */}
      {featuredGames.length > 0 && (
        <div className="px-4 py-20 bg-gradient-to-br from-white to-gray-50 relative">
          {/* Animated background elements */}
          <div
            className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-turf-200/30 to-primary-200/30 rounded-full blur-2xl"
            style={{ transform: `translateX(${scrollY * 0.03}px)` }}
          />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-turf-100 to-primary-100 rounded-full px-6 py-3 mb-4">
                  <Trophy className="w-5 h-5 text-turf-600" />
                  <span className="text-turf-700 font-medium">Featured</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900">Popular Games</h2>
                <p className="text-xl text-gray-600">Join these exciting matches happening soon</p>
              </div>
              <button
                onClick={() => navigate('/games')}
                className="flex items-center gap-2 text-turf-600 hover:text-turf-700 font-semibold group bg-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredGames.map((game, index) => (
                <div
                  key={game.id}
                  className={`transform transition-all duration-700 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{
                    transitionDelay: `${index * 200}ms`,
                    transform: `translateY(${Math.sin((scrollY + index * 300) * 0.008) * 8}px) scale(${1 + Math.sin((scrollY + index * 300) * 0.01) * 0.02})`
                  }}
                >
                  <div className="group">
                    <GameCard game={game} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Games */}
      {upcomingGames.length > 0 && (
        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Upcoming Games</h2>
            <div className="space-y-4">
              {upcomingGames.map((game) => (
                <div
                  key={game.id}
                  className="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getSportColor(game.sport)}`}>
                        {getSportIcon(game.sport)}
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">{game.sport}</h3>
                        <p className="text-sm text-gray-600">{game.turfName}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(new Date(game.date), 'MMM dd')} • {game.startTime}-{game.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {game.turfLocation}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <Users className="w-4 h-4" />
                        {game.currentPlayers}/{game.maxPlayers}
                      </div>
                      {game.perHeadContribution && (
                        <div className="text-sm font-medium text-turf-600">
                          ₹{game.perHeadContribution}/head
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Today's Games */}
      {todaysGames.length > 0 && (
        <div className="px-4 py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  Today's Games ({todaysGames.length})
                </h2>
                <p className="text-gray-600">Don't miss out on today's exciting matches</p>
              </div>
              <button
                onClick={() => navigate('/games')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group"
              >
                View All
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {todaysGames.slice(0, 2).map((game, index) => (
                <div
                  key={game.id}
                  className={`group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${getSportColor(game.sport)} group-hover:scale-110 transition-transform`}>
                        {getSportIcon(game.sport)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold capitalize text-gray-900">{game.sport}</h3>
                        <p className="text-gray-600 font-medium">{game.turfName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-turf-600">
                        {game.startTime} - {game.endTime}
                      </div>
                      <div className="text-sm text-gray-500">
                        {game.currentPlayers}/{game.maxPlayers} players
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {game.turfLocation}
                    </span>
                    {game.perHeadContribution && (
                      <span className="font-bold text-turf-600 text-lg">
                        ₹{game.perHeadContribution}/head
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Final CTA Section */}
      {!user && (
        <div className="px-4 py-20 bg-gradient-to-r from-turf-600 to-primary-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Play?
            </h2>
            <p className="text-xl text-turf-100 mb-10 max-w-2xl mx-auto">
              Join thousands of players who have found their perfect game on Playmate. Start your sports journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="group bg-white text-turf-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Join Free Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/games')}
                className="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-turf-600 px-10 py-4 text-lg font-bold rounded-2xl backdrop-blur-sm hover:backdrop-blur-none transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Search className="w-5 h-5" />
                Browse Games
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
