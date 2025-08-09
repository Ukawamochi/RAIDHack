import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import IndexPage from './pages/IndexPage'
import TestApiPage from './pages/TestApiPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import NotFoundPage from './pages/NotFoundPage'
import NewPostPage from './pages/NewPostPage'
import SettingsPage from './pages/SettingsPage'
import UserPage from './pages/UserPage'
import ProjectPage from './pages/ProjectPage'
import IdeaDetailPage from './pages/IdeaDetailPage'
import AdminPage from './pages/AdminPage'

import { AuthProvider } from './features/auth'
import Navigation from './components/Navigation'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navigation />

          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/test-api" element={<TestApiPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            <Route path="/new" element={<NewPostPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/ideas/:id" element={<IdeaDetailPage />} />
            <Route path="/admin" element={<AdminPage />} />
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
