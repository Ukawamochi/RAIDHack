import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Navigation() {
    const { isLoggedIn } = useAuth()

    return (
        <nav style={{ padding: '20px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
            <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
                Home
            </Link>
            <Link to="/login" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
                Login
            </Link>
            {isLoggedIn && (
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
        </nav>
    )
}

export default Navigation
