import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TopPage from './pages/TopPage'
import ProfilePage from './pages/ProfilePage'
import CreateIdeaPage from './pages/CreateIdeaPage'
import IdeaDetailPage from './pages/IdeaDetailPage'
import ApplicationsPage from './pages/ApplicationsPage'
import TeamsPage from './pages/TeamsPage'
import WorksPage from './pages/WorksPage'
import WorkSubmitPage from './pages/WorkSubmitPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { AdminDashboard } from './pages/AdminDashboard'
import DiscordPage from './pages/DiscordPage'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/top" 
                element={
                  <ProtectedRoute>
                    <TopPage />
                  </ProtectedRoute>
                } 
              />
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
                  <ProtectedRoute>
                    <CreateIdeaPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ideas/:id" 
                element={
                  <ProtectedRoute>
                    <IdeaDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/applications" 
                element={
                  <ProtectedRoute>
                    <ApplicationsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teams" 
                element={
                  <ProtectedRoute>
                    <TeamsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/works" 
                element={
                  <ProtectedRoute>
                    <WorksPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/works/submit" 
                element={
                  <ProtectedRoute>
                    <WorkSubmitPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/discord/:teamId" 
                element={
                  <ProtectedRoute>
                    <DiscordPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
