interface Member {
  id: string
  username: string
  avatarUrl: string
}

interface Project {
  id: string
  title: string
  username: string
  status: string
  memberCount: number
  tags: string[]
  avatar: string
  role: string
  members: Member[]
}

interface ProjectItemProps {
  project: Project
}

const ProjectItem = ({ project }: ProjectItemProps) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ホスト':
        return 'bg-green-500 text-white'
      case 'Fork':
        return 'bg-gray-500 text-white'
      case '参加':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-400 text-white'
    }
  }

  return (
    <div 
      onClick={() => console.log(`プロジェクト「${project.title}」がクリックされました`, project)}
      className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
    >
      {/* ロールバッジ */}
      <div className="mb-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(project.role)}`}>
          {project.role}
        </span>
      </div>

      {/* メイン情報 */}
      <div className="flex items-start space-x-3">
        {/* アバター */}
        <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>

        {/* 詳細情報 */}
        <div className="flex-1 min-w-0">
          {/* ユーザー名と期間 */}
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">{project.username} · {project.status}</span>
            <span className="text-xs text-gray-400">1時間前</span>
          </div>

          {/* プロジェクトタイトル */}
          <h3 className="font-medium text-gray-900 mb-2 truncate">{project.title}</h3>

          {/* メンバー表示（GitHubアイコン） */}
          <div className="flex items-center space-x-1 mb-3">
            {project.members.slice(0, 5).map((member) => (
              <div 
                key={member.id} 
                className="w-6 h-6 rounded-full overflow-hidden bg-gray-300 flex-shrink-0"
                title={member.username}
              >
                {member.avatarUrl ? (
                  <img 
                    src={member.avatarUrl} 
                    alt={member.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {member.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {project.members.length > 5 && (
              <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
                <span className="text-xs text-white font-medium">
                  +{project.members.length - 5}
                </span>
              </div>
            )}
          </div>

          {/* タグ */}
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectItem