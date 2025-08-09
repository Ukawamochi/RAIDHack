import { Link, useLocation } from 'react-router-dom'
import { GitHubAuth, useAuth } from '../features/auth'

function Navigation() {
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()

  const sidebarItems = [
    {
      icon: (
        <img src="/src/assets/react.svg" alt="React" width="20" height="20" />
      ),
      path: null,
      label: 'React'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: '/',
      label: 'ホーム'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: '/notifications',
      label: '通知'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: user ? `/${user.username}` : '/profile',
      label: 'プロフィール'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: null,
      label: 'プロジェクト'
    }
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-20 flex flex-col justify-between items-center py-6 z-50 border-r border-gray-600" style={{ minHeight: '100vh', backgroundColor: '#363A51' }}>
      <div className="flex flex-col items-center space-y-6">
        {sidebarItems.filter((item) => {
          // ログインしていない場合、プロフィールとプロジェクトを非表示
          if (!isAuthenticated && (item.label === 'プロフィール' || item.label === 'プロジェクト')) {
            return false
          }
          return true
        }).map((item, index) => {
          if (item.path === null) {
            // プロジェクトアイコンの場合、/:USER/:PROJECTパスでアクティブ判定
            const isProjectActive = item.label === 'プロジェクト' && 
              location.pathname.split('/').length === 3 && 
              location.pathname !== '/' && 
              !location.pathname.includes('/projects')
            
            return (
              <div
                key={index}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
                  ${isProjectActive 
                    ? 'bg-white text-black shadow-lg' 
                    : 'text-white'
                  }
                `}
                title={item.label}
              >
                {item.icon}
              </div>
            )
          }
          
          const isActive = location.pathname === item.path
          return (
            <Link
              key={index}
              to={item.path}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
                ${isActive 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-white hover:bg-white/10'
                }
              `}
              title={item.label}
            >
              {item.icon}
            </Link>
          )
        })}
      </div>
      
      <div className="flex items-center justify-center">
        <GitHubAuth />
      </div>
    </div>
  )
}

export default Navigation
