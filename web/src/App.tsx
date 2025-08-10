import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import IndexPage from './pages/IndexPage'
import TestApiPage from './pages/TestApiPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import NotFoundPage from './pages/NotFoundPage'
import NewPostPage from './pages/NewPostPage'
import SettingsPage from './pages/SettingsPage'
import UserPage from './pages/UserPage'
import ProjectPage from './pages/ProjectPage'
import NotificationPage from './pages/NotificationPage'

import { AuthProvider, useAuth } from './features/auth'
import Navigation from './components/Navigation'
import { ProjectList } from './features/workspace'
import { NotificationProvider, AlertContainer } from './features/notifications'
import { TimelineProvider } from './contexts/TimelineContext'
import { useLocation } from 'react-router-dom'

function AppContent() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  
  // workspaceが表示されない場合のマージン調整
  const shouldShowWorkspace = isAuthenticated && location.pathname !== '/new'
  const contentMargin = shouldShowWorkspace ? 'ml-100' : 'ml-20'

  return (
    <>
      <div className="flex">
        <Navigation />
        <ProjectList />
        <div className={`flex-1 ${contentMargin}`}>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/test-api" element={<TestApiPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            <Route path="/new" element={<NewPostPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/:username" element={<UserPage />} />
            <Route path="/:username/:project" element={<ProjectPage />} />
            <Route path="/project/:projectId" element={<ProjectPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
      <AlertContainer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <TimelineProvider>
          <Router>
            <AppContent />
          </Router>
        </TimelineProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
