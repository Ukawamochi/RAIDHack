import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import TestApiPage from './pages/TestApiPage'
import './App.css'

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '20px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
            Home
          </Link>
          <Link to="/test-api" style={{ textDecoration: 'none', color: '#007bff' }}>
            Test API
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/test-api" element={<TestApiPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
