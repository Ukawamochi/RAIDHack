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
// TODO: 未実装ページ - 後で実装
// import IdeaDetailPage from './pages/IdeaDetailPage'
// import WorksPage from './pages/WorksPage'
// import DiscordPage from './pages/DiscordPage'

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
              {/* TODO: 未実装ページのルート - 後で有効化
              <Route 
                path="/ideas/:id" 
                element={
                  <ProtectedRoute>
                    <IdeaDetailPage />
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
                path="/discord/:teamId" 
                element={
                  <ProtectedRoute>
                    <DiscordPage />
                  </ProtectedRoute>
                } 
              />
              */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
