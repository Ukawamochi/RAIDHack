import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import IndexPage from './pages/IndexPage'
import TestApiPage from './pages/TestApiPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import NewPostPage from './pages/NewPostPage'
import SettingsPage from './pages/SettingsPage'
import UserPage from './pages/UserPage'
import ProjectPage from './pages/ProjectPage'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Navigation from './components/Navigation'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navigation />

          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/test-api" element={<TestApiPage />} />
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
