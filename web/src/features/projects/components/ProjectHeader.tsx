interface ProjectData {
  id: number
  title: string
  description: string
  status: 'open' | 'development' | 'completed'
  hostName: string
  githubUrl?: string
  otherLinks?: Array<{ title: string; url: string }>
}

interface ProjectHeaderProps {
  project: ProjectData
  isHost: boolean
  onEdit: () => void
}

function ProjectHeader({ project, isHost, onEdit }: ProjectHeaderProps) {
  const statusConfig = {
    open: { text: '募集中', color: 'bg-green-600', icon: '👥' },
    development: { text: '開発中', color: 'bg-blue-600', icon: '⚡' },
    completed: { text: '完了', color: 'bg-gray-600', icon: '✅' }
  }

  const currentStatus = statusConfig[project.status]

  return (
    <div className="border-b border-gray-600 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <h1 className="text-2xl font-bold text-white">{project.title}</h1>
            <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${currentStatus.color}`}>
              <span className="mr-2">{currentStatus.icon}</span>
              {currentStatus.text}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
            <span>ホスト: {project.hostName}</span>
          </div>

          {/* リンク */}
          <div className="flex items-center space-x-4">
            {project.githubUrl && (
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-white text-sm">GitHub</span>
              </a>
            )}
            
            {project.otherLinks?.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-white text-sm">{link.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 編集ボタン（ホストのみ） */}
        {isHost && (
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>編集</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default ProjectHeader