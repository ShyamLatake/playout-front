import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { UserProvider } from './contexts/UserContext';
import { TurfProvider } from './contexts/TurfContext';
import { ToastProvider } from './contexts/ToastContext';
import BottomNavigation from './components/BottomNavigation';

import HomePage from './pages/HomePage';
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

function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <GameProvider>
          <TurfProvider>
            <Router>
            <div className="min-h-screen bg-gray-50 pb-20">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/create" element={<CreateGamePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/game/:id" element={<GameDetailPage />} />
                <Route path="/turfs" element={<TurfsPage />} />
                <Route path="/turf/:turfId" element={<TurfDetailPage />} />
                <Route path="/turf/:turfId/book" element={<BookTurfPage />} />
                <Route path="/turf-dashboard" element={<TurfOwnerDashboard />} />
                <Route path="/create-turf" element={<CreateTurfPage />} />
                <Route path="/my-dashboard" element={<UserDashboard />} />
              </Routes>
              <BottomNavigation />
            </div>
            </Router>
          </TurfProvider>
        </GameProvider>
      </UserProvider>
    </ToastProvider>
  );
}

export default App;
