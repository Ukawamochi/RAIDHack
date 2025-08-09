import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import IndexPage from './pages/IndexPage'
import TestApiPage from './pages/TestApiPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import NewPostPage from './pages/NewPostPage'
import SettingsPage from './pages/SettingsPage'

import './App.css'

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '20px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
            Home
          </Link>
          <Link to="/login" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
            Login
          </Link>
          <Link to="/new" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
            投稿
          </Link>
          <Link to="/settings" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
            設定
          </Link>
          <Link to="/test-api" style={{ textDecoration: 'none', color: '#007bff' }}>
            Test API
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/test-api" element={<TestApiPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/new" element={<NewPostPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
