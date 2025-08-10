import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../auth'
import { getProject, applyToProject, processApplication, type ProjectData } from '../../../lib/projectApi'
import ProjectChat from './ProjectChat'
import ProjectActions from './ProjectActions'

function ProjectDashboard() {
  const { username, project: projectNameRaw, projectId } = useParams<{ 
    username?: string; 
    project?: string; 
    projectId?: string 
  }>()
  
  // URLデコードして日本語に対応
  const projectName = projectNameRaw ? decodeURIComponent(projectNameRaw) : undefined
  const { user } = useAuth()
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isHost = user?.id === project?.hostId

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        console.log('Fetching project with username:', username, 'projectName:', projectName, 'projectId:', projectId)
        
        // IDベースのルート (/project/:projectId) の場合
        if (projectId) {
          try {
            // プロジェクトIDから直接取得する場合のAPI呼び出し
            // 今回は既存のAPIを使うため、モックデータで代用
            console.log('Using project ID route:', projectId)
            const mockProject: ProjectData = {
              id: parseInt(projectId),
              title: 'プロジェクト' + projectId,
              description: 'プロジェクトID ' + projectId + ' の詳細です。日本語タイトルでも正しく表示されます。',
              status: 'open',
              hostId: user?.id || 1,
              hostName: user?.username || 'サンプルホスト',
              githubUrl: 'https://github.com/example/project',
              otherLinks: [
                { title: 'デモサイト', url: 'https://example.com' }
              ],
              members: [
                { id: 1, name: 'メンバー1', role: 'leader', joinedAt: '2024-01-01' },
                { id: 2, name: 'メンバー2', role: 'member', joinedAt: '2024-01-02' }
              ],
              applicants: [],
              isRecruitingEnabled: true,
              maxMembers: 10,
              progressPercentage: 30,
              createdAt: '2024-01-01',
              updatedAt: '2024-01-05'
            }
            setProject(mockProject)
          } catch (apiError) {
            console.warn('Project ID API failed:', apiError)
            setError('プロジェクトIDでの取得に失敗しました')
          }
        }
        // ユーザー名/プロジェクト名ベースのルート (/:username/:project) の場合
        else if (username && projectName) {
          try {
            const projectData = await getProject(username, projectName)
            console.log('Project data received:', projectData)
            setProject(projectData)
          } catch (apiError) {
            console.warn('API failed, using mock data:', apiError)
            
            // モックデータを使用
            const mockProject: ProjectData = {
              id: 1, // プロジェクトIDは1に固定
              title: 'サンプルプロジェクト',
              description: 'これはサンプルのプロジェクト詳細です。APIからデータが取得できない場合に表示されています。',
              status: 'open',
              hostId: user?.id || 1,
              hostName: user?.username || 'サンプルホスト',
              githubUrl: 'https://github.com/example/project',
              otherLinks: [
                { title: 'デモサイト', url: 'https://example.com' }
              ],
              members: [
                { id: 1, name: 'メンバー1', role: 'leader', joinedAt: '2024-01-01' },
                { id: 2, name: 'メンバー2', role: 'member', joinedAt: '2024-01-02' }
              ],
              applicants: [
                { 
                  id: 1, 
                  userId: 3, 
                  username: '申請者1', 
                  message: '参加したいです！', 
                  appliedAt: '2024-01-03' 
                }
              ],
              isRecruitingEnabled: true,
              maxMembers: 10,
              progressPercentage: 30,
              createdAt: '2024-01-01',
              updatedAt: '2024-01-05'
            }
            setProject(mockProject)
          }
        } else {
          setError('無効なパラメータです (username: ' + username + ', projectName: ' + projectName + ', projectId: ' + projectId + ')')
        }
      } catch (err) {
        setError('プロジェクトの取得に失敗しました: ' + (err as Error).message)
        console.error('Failed to fetch project:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [username, projectName, projectId, user])


  const handleApplyToProject = async () => {
    if (!project) return
    
    try {
      await applyToProject(project.id, 'このプロジェクトに参加したいです！')
      // TODO: 成功メッセージを表示
    } catch (err) {
      console.error('Failed to apply to project:', err)
    }
  }

  const handleApplicationAction = async (applicationId: number, action: 'approve' | 'reject') => {
    if (!project || !username || !projectName) return
    
    try {
      await processApplication(username, projectName, applicationId, action)
      // 申請リストから削除または更新
      setProject({
        ...project,
        applicants: project.applicants.filter(app => app.id !== applicationId)
      })
    } catch (err) {
      console.error('Failed to process application:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2A2D3A' }}>
        <div className="text-white">読み込み中...</div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2A2D3A' }}>
        <div className="text-red-400">{error || 'プロジェクトが見つかりません'}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#4A4D5A]">
      {/* メインコンテンツエリア */}
      <div className="ml-20 flex">
        {/* 左側：プロジェクト詳細 */}
        <div className="flex-1 p-8">
          {/* プロジェクトヘッダー */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full"></div>
              <div>
                <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                <p className="text-gray-300">{project.members.length}メンバー</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {project.members.slice(0, 4).map((member, i) => (
                    <div key={i} className="w-8 h-8 bg-blue-500 rounded-full border-2 border-[#4A4D5A] flex items-center justify-center">
                      <span className="text-white text-xs">{member.name.charAt(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 募集中ステータス */}
              <div className="flex items-center space-x-2 bg-green-500 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-medium">募集中</span>
              </div>
              
              {isHost && (
                <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors">
                  編集
                </button>
              )}
              
              <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors">
                その他
              </button>
            </div>
          </div>

          {/* プロジェクト説明 */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <p className="text-gray-800 leading-relaxed text-lg">{project.description}</p>
            
            {/* タグ/技術スタック */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">#AI</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">#JavaScript</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">#CSS</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">#Webアプリ</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">#Node.js</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">#React</span>
              </div>
            </div>
          </div>

          {/* 申請者一覧（ホストのみ表示） */}
          {isHost && project.applicants.length > 0 && (
            <div className="bg-white rounded-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">参加申請</h3>
              <div className="space-y-4">
                {project.applicants.map((applicant) => (
                  <div key={applicant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">{applicant.username.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{applicant.username}</div>
                        {applicant.message && (
                          <div className="text-gray-600 text-sm mt-1">{applicant.message}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleApplicationAction(applicant.id, 'approve')}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 font-medium"
                      >
                        承認
                      </button>
                      <button 
                        onClick={() => handleApplicationAction(applicant.id, 'reject')}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 font-medium"
                      >
                        拒否
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 参加ボタン（非ホスト向け） */}
          {!isHost && project.isRecruitingEnabled && (
            <div className="bg-white rounded-lg p-8">
              <button 
                onClick={handleApplyToProject}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                このプロジェクトに参加申請
              </button>
            </div>
          )}
        </div>

        {/* 右側：チャット */}
        <div className="w-96 bg-[#4A4D5A] border-l border-[#5A5D6A]">
          <ProjectChat 
            projectId={projectName || ''} 
            isHost={isHost} 
          />
        </div>
      </div>
  {/* フローティングアクション（Figma対応の簡易版） */}
  <ProjectActions project={{ id: project.id, title: project.title, status: project.status }} />
    </div>
  )
}

export default ProjectDashboard