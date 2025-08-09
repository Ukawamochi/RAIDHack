import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import './Navbar.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      // 30秒ごとに未読数を更新
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE}/api/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count)
      }
    } catch (error) {
      console.error('未読通知数の取得に失敗しました:', error)
    }
  }

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
          <Link 
            to="/teams" 
            className={`navbar-link ${location.pathname === '/teams' ? 'active' : ''}`}
          >
            チーム
          </Link>
          <Link 
            to="/applications" 
            className={`navbar-link ${location.pathname === '/applications' ? 'active' : ''}`}
          >
            応募履歴
          </Link>
          <Link 
            to="/discord" 
            className={`navbar-link ${location.pathname === '/discord' ? 'active' : ''}`}
          >
            Discord
          </Link>
          <Link 
            to="/works" 
            className={`navbar-link ${location.pathname === '/works' || location.pathname === '/works/submit' ? 'active' : ''}`}
          >
            作品
          </Link>

        </div>

        <div className="navbar-user">
          {/* 通知ベル */}
          <Link 
            to="/notifications" 
            className={`navbar-notification ${location.pathname === '/notifications' ? 'active' : ''}`}
            title="通知"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="navbar-notification-badge">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
          
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
