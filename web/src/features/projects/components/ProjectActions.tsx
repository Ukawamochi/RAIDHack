import { useState } from 'react'

interface ProjectData {
  id: number
  title: string
  status: 'open' | 'development' | 'completed'
}

interface ProjectActionsProps {
  project: ProjectData
}

function ProjectActions({ project }: ProjectActionsProps) {
  const [showActions, setShowActions] = useState(false)

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'edit':
        // TODO: 編集モーダルを開く
        console.log('Edit project')
        break
      case 'settings':
        // TODO: 設定モーダルを開く
        console.log('Open settings')
        break
      case 'share':
        // TODO: 共有モーダルを開く
        console.log('Share project')
        break
      case 'analytics':
        // TODO: 分析ページを開く
        console.log('View analytics')
        break
      default:
        break
    }
    setShowActions(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* アクションメニュー */}
      {showActions && (
        <div className="absolute bottom-16 right-0 bg-gray-800 rounded-lg shadow-lg border border-gray-600 py-2 min-w-48">
          <button
            onClick={() => handleQuickAction('edit')}
            className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-200 hover:bg-gray-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>プロジェクトを編集</span>
          </button>

          <button
            onClick={() => handleQuickAction('settings')}
            className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-200 hover:bg-gray-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>設定</span>
          </button>

          <button
            onClick={() => handleQuickAction('share')}
            className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-200 hover:bg-gray-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>共有</span>
          </button>

          <button
            onClick={() => handleQuickAction('analytics')}
            className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-200 hover:bg-gray-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.7 8l-5.1 5.1-2.8-2.8L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>統計・分析</span>
          </button>
        </div>
      )}

      {/* フローティングアクションボタン */}
      <button
        onClick={() => setShowActions(!showActions)}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200
          ${showActions 
            ? 'bg-red-600 hover:bg-red-700 rotate-45' 
            : 'bg-blue-600 hover:bg-blue-700'
          }
        `}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="text-white"
        >
          <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

export default ProjectActions