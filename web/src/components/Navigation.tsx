import { Link } from 'react-router-dom'
import { GitHubAuth, useAuth } from '../features/auth'

function Navigation() {
  const { isAuthenticated } = useAuth()

  return (
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
      {isAuthenticated && (
        <>
          <Link to="/new" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
            投稿
          </Link>
          <Link to="/settings" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
            設定
          </Link>
        </>
      )}
      <Link to="/test-api" style={{ textDecoration: 'none', color: '#007bff' }}>
        Test API
      </Link>
      <GitHubAuth />
    </nav>
  )
}

export default Navigation
