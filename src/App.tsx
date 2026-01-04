import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameProvider } from "./contexts/GameContext";
import { UserProvider } from "./contexts/UserContext";
import { TurfProvider } from "./contexts/TurfContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ResponsiveLayout } from "./components/layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRedirect from "./components/DashboardRedirect";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InterestSelectionPage from "./pages/InterestSelectionPage";
import GamesPage from "./pages/GamesPage";
import CreateGamePage from "./pages/CreateGamePage";
import ProfilePage from "./pages/ProfilePage";
import GameDetailPage from "./pages/GameDetailPage";
import TurfsPage from "./pages/TurfsPage";
import BookTurfPage from "./pages/BookTurfPage";
import TurfOwnerDashboard from "./pages/turf_owner/TurfOwnerDashboard";
import CreateTurfPage from "./pages/turf_owner/CreateTurfPage";
import TurfDetailPage from "./pages/TurfDetailPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { DebugPage } from "./pages/DebugPage";
import ListOwnerTurfs from "./pages/turf_owner/ListOwnerTurfs";
import ViewTurf from "./pages/turf_owner/ViewTurf";
import EditTurf from "./pages/turf_owner/EditTurf";
import TurfBookings from "./pages/turf_owner/TurfBookings";

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

                  {/* Interest Selection - Protected but shown after registration */}
                  <Route
                    path="/select-interests"
                    element={
                      <ProtectedRoute>
                        <InterestSelectionPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/games" element={<GamesPage />} />
                  <Route path="/turfs" element={<TurfsPage />} />
                  <Route path="/game/:id" element={<GameDetailPage />} />
                  <Route path="/turf/:turfId" element={<TurfDetailPage />} />

                  {/* Protected Routes - Require Authentication */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/create"
                    element={
                      <ProtectedRoute allowedUserTypes={["normal_user"]}>
                        <CreateGamePage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/turf/:turfId/book"
                    element={
                      <ProtectedRoute>
                        <BookTurfPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* User Dashboard - Normal Users Only */}
                  <Route
                    path="/my-dashboard"
                    element={
                      <ProtectedRoute allowedUserTypes={["normal_user"]}>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Turf Owner Routes */}
                  <Route
                    path="/turf-owner"
                    element={
                      <ProtectedRoute allowedUserTypes={["turf_owner"]}>
                        <TurfOwnerDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/turf-owner/create-turf"
                    element={
                      <ProtectedRoute allowedUserTypes={["turf_owner"]}>
                        <CreateTurfPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/turf-owner/turfs"
                    element={
                      <ProtectedRoute allowedUserTypes={["turf_owner"]}>
                        <ListOwnerTurfs />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/turf-owner/view-turf/:id"
                    element={
                      <ProtectedRoute allowedUserTypes={["turf_owner"]}>
                        <ViewTurf />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/turf-owner/turfs/:id"
                    element={
                      <ProtectedRoute allowedUserTypes={["turf_owner"]}>
                        <EditTurf />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/turf-owner/turf/:id/bookings"
                    element={
                      <ProtectedRoute allowedUserTypes={["turf_owner"]}>
                        <TurfBookings />
                      </ProtectedRoute>
                    }
                  />

                  {/* Debug Route - Remove in production */}
                  <Route path="/debug" element={<DebugPage />} />

                  {/* Admin Routes */}
                  <Route
                    path="/admin-dashboard"
                    element={
                      <ProtectedRoute allowedUserTypes={["admin"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
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
