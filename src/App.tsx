"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Suspense, lazy } from "react"
import { AuthProvider } from "./contexts/AuthContext"
import { DataProvider } from "./contexts/DataContext"
import { LanguageProvider } from "./contexts/LanguageContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import { useAuth } from "./contexts/AuthContext"
import { useLanguage } from "./contexts/LanguageContext"
import Header from "./components/Header"

// Lazy load all pages for better code splitting
const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Teams = lazy(() => import("./pages/Teams"))
const Players = lazy(() => import("./pages/Players"))
const Tournaments = lazy(() => import("./pages/Tournaments"))
const Matches = lazy(() => import("./pages/Matches"))
const LiveMatch = lazy(() => import("./pages/LiveMatch"))
const Stats = lazy(() => import("./pages/Stats"))
const Admin = lazy(() => import("./pages/Admin"))
const Profile = lazy(() => import("./pages/Profile"))
const Heroes = lazy(() => import("./pages/Heroes"))
const Groups = lazy(() => import("./pages/Groups"))
const PlayerManagement = lazy(() => import("./pages/PlayerManagement"))
const Stadiums = lazy(() => import("./pages/Stadiums"))
const TVDisplay = lazy(() => import("./pages/TVDisplay"))
const SocialWall = lazy(() => import("./pages/SocialWall"))
const PaymentCenter = lazy(() => import("./pages/PaymentCenter"))
const PlayerCards = lazy(() => import("./pages/PlayerCards"))
const TournamentAI = lazy(() => import("./pages/TournamentAI"))
const Store = lazy(() => import("./pages/Store"))
const FreePlayers = lazy(() => import("./pages/FreePlayers"))
const Sponsors = lazy(() => import("./pages/Sponsors"))

import { useParams } from "react-router-dom"
import { PageLoading } from "./components/ui/loading-spinner"
import "./App.css"

// Wrapper pour LiveMatch qui récupère le matchId depuis l'URL
const LiveMatchWrapper: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>()
  return matchId ? <LiveMatch matchId={matchId} /> : <div>Match ID manquant</div>
}

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <PageLoading />
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />
}

// Read Only Route Component - Permet l'accès en lecture seule à tous les utilisateurs connectés
const ReadOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <PageLoading />
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />
}

// App Layout Component
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const { isRTL } = useLanguage()

  return (
    <div 
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {user && <Header />}
      <main className={user ? "pt-16" : ""}>
        <Suspense fallback={<PageLoading />}>
          {children}
        </Suspense>
      </main>
    </div>
  )
}

// Main App Component with Providers
const AppContent: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <Router>
              <AppLayout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/free-players" element={<FreePlayers />} />
                  <Route path="/sponsors" element={<Sponsors />} />

                  {/* Read Only Routes - Accessible à tous les utilisateurs connectés */}
                  <Route
                    path="/dashboard"
                    element={
                      <ReadOnlyRoute>
                        <Dashboard />
                      </ReadOnlyRoute>
                    }
                  />
                  <Route
                    path="/teams"
                    element={
                      <ReadOnlyRoute>
                        <Teams />
                      </ReadOnlyRoute>
                    }
                  />
                  <Route
                    path="/players"
                    element={
                      <ReadOnlyRoute>
                        <Players />
                      </ReadOnlyRoute>
                    }
                  />
                  <Route
                    path="/tournaments"
                    element={
                      <ReadOnlyRoute>
                        <Tournaments />
                      </ReadOnlyRoute>
                    }
                  />
                  <Route
                    path="/groups"
                    element={
                      <ReadOnlyRoute>
                        <Groups />
                      </ReadOnlyRoute>
                    }
                  />
                  <Route
                    path="/matches"
                    element={
                      <ReadOnlyRoute>
                        <Matches />
                      </ReadOnlyRoute>
                    }
                  />
                  <Route
                    path="/live-match/:matchId"
                    element={
                      <ReadOnlyRoute>
                        <LiveMatchWrapper />
                      </ReadOnlyRoute>
                    }
                  />
                  <Route
                    path="/stats"
                    element={
                      <ReadOnlyRoute>
                        <Stats />
                      </ReadOnlyRoute>
                    }
                  />
                  {/* Routes Admin - Seulement pour les admins */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/player-management"
                    element={
                      <ProtectedRoute>
                        <PlayerManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/stadiums"
                    element={
                      <ReadOnlyRoute>
                        <Stadiums />
                      </ReadOnlyRoute>
                    }
                  />

                  {/* Read Only Routes - Accessible à tous les utilisateurs connectés */}
                  <Route
                    path="/profile"
                    element={
                      <ReadOnlyRoute>
                        <Profile />
                      </ReadOnlyRoute>
                    }
                  />
                  <Route
                    path="/heroes"
                    element={
                      <ReadOnlyRoute>
                        <Heroes />
                      </ReadOnlyRoute>
                    }
                  />

                  {/* Nouvelles routes pour les fonctionnalités avancées - Lecture seule */}
                  <Route
                    path="/tv-display"
                    element={
                      <ReadOnlyRoute>
                        <TVDisplay />
                      </ReadOnlyRoute>
                    }
                  />
                  <Route
                    path="/social"
                    element={
                      <ReadOnlyRoute>
                        <SocialWall />
                      </ReadOnlyRoute>
                    }
                  />
                  <Route
                    path="/payments"
                    element={
                      <ReadOnlyRoute>
                        <PaymentCenter />
                      </ReadOnlyRoute>
                    }
                  />
                  <Route
                    path="/player-cards"
                    element={
                      <ReadOnlyRoute>
                        <PlayerCards />
                      </ReadOnlyRoute>
                    }
                  />
                  <Route
                    path="/tournament-ai"
                    element={
                      <ReadOnlyRoute>
                        <TournamentAI />
                      </ReadOnlyRoute>
                    }
                  />

                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            </Router>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

// Root App Component
const App: React.FC = () => {
  return <AppContent />
}

export default App
