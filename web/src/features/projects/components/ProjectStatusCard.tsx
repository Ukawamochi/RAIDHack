interface ProjectStatusData {
  id: number
  title: string
  status: 'open' | 'development' | 'completed'
  isRecruitingEnabled: boolean
}

interface ProjectStatusCardProps {
  project: ProjectStatusData
  isHost: boolean
  onStatusChange: (status: ProjectStatusData['status']) => void
  onRecruitingToggle: () => void
}

function ProjectStatusCard({ project, isHost, onStatusChange, onRecruitingToggle }: ProjectStatusCardProps) {
  const statusOptions = [
    { value: 'open' as const, label: '募集中', icon: '👥', color: 'bg-green-600' },
    { value: 'development' as const, label: '開発中', icon: '⚡', color: 'bg-blue-600' },
    { value: 'completed' as const, label: '完了', icon: '✅', color: 'bg-gray-600' }
  ]

  const currentStatusConfig = statusOptions.find(s => s.value === project.status)

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">プロジェクトステータス</h3>
      
      <div className="space-y-4">
        {/* 現在のステータス */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">開発ステータス</span>
          <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${currentStatusConfig?.color}`}>
            <span className="mr-2">{currentStatusConfig?.icon}</span>
            {currentStatusConfig?.label}
          </div>
        </div>

        {/* ホストのみのコントロール */}
        {isHost && (
          <>
            {/* ステータス変更 */}
            <div className="space-y-3">
              <span className="text-gray-300 text-sm">ステータスを変更:</span>
              <div className="flex space-x-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => onStatusChange(status.value)}
                    disabled={project.status === status.value}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${project.status === status.value 
                        ? `${status.color} text-white cursor-not-allowed` 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }
                    `}
                  >
                    <span className="mr-2">{status.icon}</span>
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 募集ON/OFF */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <div>
                <span className="text-gray-300">募集</span>
                <p className="text-sm text-gray-400">新しいメンバーの参加を受け付ける</p>
              </div>
              <button
                onClick={onRecruitingToggle}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${project.isRecruitingEnabled ? 'bg-green-600' : 'bg-gray-600'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${project.isRecruitingEnabled ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </>
        )}

        {/* 募集ステータス（非ホスト向け表示） */}
        {!isHost && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <span className="text-gray-300">募集ステータス</span>
            <div className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${project.isRecruitingEnabled 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-600 text-gray-300'
              }
            `}>
              {project.isRecruitingEnabled ? '募集中' : '募集停止'}
            </div>
          </div>
        )}

        {/* 参加ボタン（非ホスト向け） */}
        {!isHost && project.isRecruitingEnabled && (
          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            このプロジェクトに参加申請
          </button>
        )}
      </div>
    </div>
  )
}

export default ProjectStatusCard