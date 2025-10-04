import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import { CreateGameForm, Sport } from '../types';
import { Activity, Zap, Target, Dumbbell, ArrowLeft, Calendar, Clock, MapPin, Users, DollarSign, FileText } from 'lucide-react';

const CreateGamePage: React.FC = () => {
  const navigate = useNavigate();
  const { createGame, isLoading } = useGame();
  const { user } = useUser();
  const [formData, setFormData] = useState<CreateGameForm>({
    sport: 'cricket',
    date: '',
    startTime: '17:00',
    endTime: '19:00',
    turfName: '',
    turfLocation: '',
    maxPlayers: 22,
    requiredPlayers: 5,
    perHeadContribution: undefined,
    isOfflineBooking: false,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const sports: { value: Sport; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'cricket', label: 'Cricket', icon: <Activity className="w-5 h-5" />, color: 'bg-cricket-100 text-cricket-800 border-cricket-200' },
    { value: 'football', label: 'Football', icon: <Zap className="w-5 h-5" />, color: 'bg-football-100 text-football-800 border-football-200' },
    { value: 'tennis', label: 'Tennis', icon: <Target className="w-5 h-5" />, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'badminton', label: 'Badminton', icon: <Dumbbell className="w-5 h-5" />, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  ];

  const maxPlayersOptions = {
    cricket: [22, 11, 6],
    football: [14, 10, 7],
    tennis: [4, 2],
    badminton: [4, 2],
  };

  const handleInputChange = (field: keyof CreateGameForm, value: string | number | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.turfName.trim()) {
      newErrors.turfName = 'Turf name is required';
    }
    if (!formData.turfLocation.trim()) {
      newErrors.turfLocation = 'Turf location is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }
    if (formData.requiredPlayers > formData.maxPlayers) {
      newErrors.requiredPlayers = 'Required players cannot exceed max players';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createGame(formData);
      navigate('/games');
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please login to create a game</h2>
          <button
            onClick={() => navigate('/profile')}
            className="btn-primary"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Create New Game</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sport Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Sport
              </label>
              <div className="grid grid-cols-2 gap-3">
                {sports.map((sport) => (
                  <button
                    key={sport.value}
                    type="button"
                    onClick={() => handleInputChange('sport', sport.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.sport === sport.value
                        ? `${sport.color} border-current`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {sport.icon}
                      <span className="font-medium">{sport.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`input-field ${errors.date ? 'border-red-500' : ''}`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className={`input-field ${errors.startTime ? 'border-red-500' : ''}`}
                  />
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className={`input-field ${errors.endTime ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
              </div>
            </div>

            {/* Booking Type */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Turf Booking Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('isOfflineBooking', false)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      !formData.isOfflineBooking
                        ? 'bg-primary-100 text-primary-800 border-primary-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <span className="font-medium">Need to Book</span>
                      <p className="text-xs mt-1">I need to book the turf</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('isOfflineBooking', true)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.isOfflineBooking
                        ? 'bg-turf-100 text-turf-800 border-turf-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <span className="font-medium">Already Booked</span>
                      <p className="text-xs mt-1">Turf is already booked</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Turf Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Turf Name
                </label>
                <input
                  type="text"
                  value={formData.turfName}
                  onChange={(e) => handleInputChange('turfName', e.target.value)}
                  placeholder="e.g., Turf Up, Green Field"
                  className={`input-field ${errors.turfName ? 'border-red-500' : ''}`}
                />
                {errors.turfName && <p className="text-red-500 text-sm mt-1">{errors.turfName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Turf Location
                </label>
                <input
                  type="text"
                  value={formData.turfLocation}
                  onChange={(e) => handleInputChange('turfLocation', e.target.value)}
                  placeholder="e.g., Downtown Sports Complex"
                  className={`input-field ${errors.turfLocation ? 'border-red-500' : ''}`}
                />
                {errors.turfLocation && <p className="text-red-500 text-sm mt-1">{errors.turfLocation}</p>}
              </div>
            </div>

            {/* Player Counts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Maximum Players
                </label>
                <select
                  value={formData.maxPlayers}
                  onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value))}
                  className="input-field"
                >
                  {maxPlayersOptions[formData.sport].map((count) => (
                    <option key={count} value={count}>
                      {count} players
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Additional Players Needed
                </label>
                <input
                  type="number"
                  value={formData.requiredPlayers}
                  onChange={(e) => handleInputChange('requiredPlayers', parseInt(e.target.value))}
                  min="1"
                  max={formData.maxPlayers - 1}
                  className={`input-field ${errors.requiredPlayers ? 'border-red-500' : ''}`}
                />
                {errors.requiredPlayers && <p className="text-red-500 text-sm mt-1">{errors.requiredPlayers}</p>}
              </div>
            </div>

            {/* Per Head Contribution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Per Head Contribution (Optional)
              </label>
              <input
                type="number"
                value={formData.perHeadContribution || ''}
                onChange={(e) => handleInputChange('perHeadContribution', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g., 15"
                min="0"
                className="input-field"
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave empty if no contribution is required
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Game Description (Optional)
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add any additional details about the game, skill level, etc."
                rows={3}
                className="input-field"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Game...' : 'Create Game'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGamePage;
