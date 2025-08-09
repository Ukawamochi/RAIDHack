import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'

import IndexPage from './pages/IndexPage'
import TestApiPage from './pages/TestApiPage'
import LoginPage from './pages/LoginPage'
import NewPostPage from './pages/NewPostPage'
import SettingsPage from './pages/SettingsPage'
// import UserPage from './pages/UserPage'
// import ProjectPage from './pages/ProjectPage'
import NotFoundPage from './pages/NotFoundPage'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#1a1a1a', // ダークグレー背景
          width: '100%'
        }}>
          <Header />

          <main style={{ width: '100%' }}>
            <Routes>
              {/* パブリックルート */}
              <Route path="/" element={<IndexPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* 認証保護ルート */}
              <Route
                path="/new"
                element={
                  <ProtectedRoute>
                    <NewPostPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* テスト用ルート */}
              <Route path="/test-api" element={<TestApiPage />} />

              {/* GitHub風ルート - ユーザーページとプロジェクトページ */}
              <Route path="/:username/:project" element={<></>} />
              <Route path="/:username" element={<></>} />

              {/* 404ページ */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
