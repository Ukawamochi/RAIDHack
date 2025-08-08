import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // ホームページでは異なるナビゲーションを表示
  if (location.pathname === '/') {
    return (
      <nav className="navbar navbar-home">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            RAIDHack
          </Link>
          <div className="navbar-menu">
            {user ? (
              <>
                <Link to="/top" className="navbar-link">
                  ダッシュボード
                </Link>
                <button onClick={handleLogout} className="navbar-button secondary">
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link">
                  ログイン
                </Link>
                <Link to="/register" className="navbar-button primary">
                  新規登録
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    )
  }

  // ログイン・登録ページでは最小限のナビゲーション
  if (location.pathname === '/login' || location.pathname === '/register') {
    return (
      <nav className="navbar navbar-minimal">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            RAIDHack
          </Link>
        </div>
      </nav>
    )
  }

  // 認証済みページでのフルナビゲーション
  return (
    <nav className="navbar navbar-main">
      <div className="navbar-container">
        <Link to="/top" className="navbar-logo">
          RAIDHack
        </Link>
        
        <div className="navbar-menu">
          <Link 
            to="/top" 
            className={`navbar-link ${location.pathname === '/top' ? 'active' : ''}`}
          >
            ホーム
          </Link>
          <Link 
            to="/create" 
            className={`navbar-link ${location.pathname === '/create' ? 'active' : ''}`}
          >
            アイデア投稿
          </Link>
          {/* TODO: 未実装ページ - 後で有効化
          <Link 
            to="/works" 
            className={`navbar-link ${location.pathname === '/works' ? 'active' : ''}`}
          >
            成果物
          </Link>
          */}
        </div>

        <div className="navbar-user">
          <Link 
            to="/profile" 
            className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            <span className="navbar-username">{user?.username}</span>
          </Link>
          <button onClick={handleLogout} className="navbar-button secondary">
            ログアウト
          </button>
        </div>
      </div>
    </nav>
  )
}
