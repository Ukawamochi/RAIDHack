import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import IndexPage from './pages/IndexPage'
import TestApiPage from './pages/TestApiPage'
import LoginPage from './pages/LoginPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import NotFoundPage from './pages/NotFoundPage'
import NewPostPage from './pages/NewPostPage'
import SettingsPage from './pages/SettingsPage'
import UserPage from './pages/UserPage'
import ProjectPage from './pages/ProjectPage'

import { AuthProvider, GitHubAuth } from './features/auth'
import PrivateRoute from './components/PrivateRoute'
import Navigation from './components/Navigation'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <nav style={{ 
            padding: '20px', 
            borderBottom: '1px solid #ccc', 
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
              Home
            </Link>
            <Link to="/test-api" style={{ textDecoration: 'none', color: '#007bff' }}>
              Test API
            </Link>
            <GitHubAuth />
          </nav>
              
          {/* todo: migrate <Navigation /> */}

          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/test-api" element={<TestApiPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/new" element={<PrivateRoute><NewPostPage /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
            <Route path="/user/:username" element={<UserPage />} />
            <Route path="/user/:username/:project" element={<ProjectPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
