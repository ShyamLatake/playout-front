import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { UserProvider } from './contexts/UserContext';
import { TurfProvider } from './contexts/TurfContext';
import { ToastProvider } from './contexts/ToastContext';
import { ResponsiveLayout } from './components/layout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRedirect from './components/DashboardRedirect';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GamesPage from './pages/GamesPage';
import CreateGamePage from './pages/CreateGamePage';
import ProfilePage from './pages/ProfilePage';
import GameDetailPage from './pages/GameDetailPage';
import TurfsPage from './pages/TurfsPage';
import BookTurfPage from './pages/BookTurfPage';
import TurfOwnerDashboard from './pages/TurfOwnerDashboard';
import CreateTurfPage from './pages/CreateTurfPage';
import TurfDetailPage from './pages/TurfDetailPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <GameProvider>
          <TurfProvider>
            <Router>
              <ResponsiveLayout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard" element={<DashboardRedirect />} />
                  <Route path="/games" element={<GamesPage />} />
                  <Route path="/turfs" element={<TurfsPage />} />
                  <Route path="/game/:id" element={<GameDetailPage />} />
                  <Route path="/turf/:turfId" element={<TurfDetailPage />} />
                  
                  {/* Protected Routes - Require Authentication */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/create" element={
                    <ProtectedRoute allowedUserTypes={['normal_user']}>
                      <CreateGamePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/turf/:turfId/book" element={
                    <ProtectedRoute>
                      <BookTurfPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* User Dashboard - Normal Users Only */}
                  <Route path="/my-dashboard" element={
                    <ProtectedRoute allowedUserTypes={['normal_user']}>
                      <UserDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Turf Owner Routes */}
                  <Route path="/turf-dashboard" element={
                    <ProtectedRoute allowedUserTypes={['turf_owner']}>
                      <TurfOwnerDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/create-turf" element={
                    <ProtectedRoute allowedUserTypes={['turf_owner']}>
                      <CreateTurfPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin-dashboard" element={
                    <ProtectedRoute allowedUserTypes={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </ResponsiveLayout>
            </Router>
          </TurfProvider>
        </GameProvider>
      </UserProvider>
    </ToastProvider>
  );
}

export default App;
