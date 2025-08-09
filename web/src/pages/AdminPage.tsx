import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth'
import { Idea } from '../types/api'

interface AdminStats {
  users?: number
  ideas?: number
  teams?: number
  works?: number
  applications?: number
  votes?: number
}

function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const [stats, setStats] = useState<AdminStats>({})
  const [projects, setProjects] = useState<Idea[]>([])
  const [selectedProject, setSelectedProject] = useState<Idea | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData()
    }
  }, [isAuthenticated])

  const fetchAdminData = async () => {
    try {
      // 統計情報を取得
      const statsResponse = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats || {})
      }

      // プロジェクト一覧を取得（進行中のプロジェクトのみ）
      const projectsResponse = await fetch('/api/ideas?status=development', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData.ideas || [])
        // 最初のプロジェクトを選択
        if (projectsData.ideas && projectsData.ideas.length > 0) {
          setSelectedProject(projectsData.ideas[0])
        }
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // TODO: 管理者権限チェック機能を実装
  // if (!user.isAdmin) {
  //   return <Navigate to="/" replace />
  // }

  if (loadingData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>データを読み込み中...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      backgroundColor: '#363a51', 
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Inter', 'Noto Sans JP', sans-serif"
    }}>
      {/* 左側サイドバー - プロジェクト一覧 */}
      <div style={{
        width: '534px',
        backgroundColor: 'rgba(255,255,255,0.08)',
        position: 'relative'
      }}>
        {/* アバター部分 */}
        <div style={{
          width: '125px',
          backgroundColor: '#363a51',
          height: '100vh',
          position: 'absolute',
          left: 0,
          top: 0
        }}>
          {/* TODO: ユーザーアバター一覧を実装 */}
          {[...Array(6)].map((_, index) => (
            <div 
              key={index}
              style={{
                width: '77px',
                height: '77px',
                borderRadius: '50%',
                backgroundColor: index === 0 ? '#ffffff' : 'rgba(255,255,255,0.3)',
                margin: '24px',
                marginTop: index === 0 ? '37px' : '24px'
              }}
            />
          ))}
        </div>

        {/* プロジェクト一覧 */}
        <div style={{ marginLeft: '125px', padding: '0 32px' }}>
          {/* ヘッダー */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '16px 24px',
            margin: '47px 0 20px',
            fontSize: '24px',
            color: '#000'
          }}>
            進行中のプロジェクト
          </div>

          {/* プロジェクトリスト */}
          {projects.map((project, index) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '20px 24px',
                marginBottom: '28px',
                cursor: 'pointer',
                border: selectedProject?.id === project.id ? '3px solid #007bff' : 'none',
                position: 'relative'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <h3 style={{
                  fontSize: '24px',
                  color: '#363a51',
                  margin: 0,
                  fontWeight: 'normal'
                }}>
                  {project.title}
                </h3>
                
                {/* ステータスバッジ */}
                <div style={{
                  backgroundColor: '#d9d9d9',
                  borderRadius: '28.5px',
                  padding: '4px 16px',
                  fontSize: '15px',
                  color: '#000'
                }}>
                  {index === 0 ? 'ホスト' : index === 1 ? '参加' : 'Fork'}
                </div>
              </div>

              {/* プロジェクト参加者アバター */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '16px'
              }}>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#ccc'
                    }}
                  />
                ))}
              </div>

              {/* 区切り線 */}
              <div style={{
                height: '1px',
                backgroundColor: '#e0e0e0',
                margin: '16px -24px'
              }} />

              {/* 更新日時 */}
              <div style={{
                fontSize: '16px',
                color: '#a19f9f',
                marginTop: '8px'
              }}>
                {new Date(project.updated_at).toLocaleDateString('ja-JP')}前
              </div>

              {/* 通知バッジ */}
              <div style={{
                position: 'absolute',
                right: '8px',
                top: '8px',
                width: '26px',
                height: '26px',
                backgroundColor: '#ff4444',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '15px',
                fontWeight: 'bold'
              }}>
                {index === 0 ? '2' : '1'}
              </div>
            </div>
          ))}

          {/* 投稿ボタン */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '9px',
            height: '84px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '24px',
            cursor: 'pointer'
          }}>
            <span style={{
              fontSize: '48px',
              color: '#000'
            }}>
              ＋
            </span>
            <span style={{
              fontSize: '16px',
              color: '#000',
              marginLeft: '16px'
            }}>
              投稿
            </span>
          </div>
        </div>
      </div>

      {/* 右側メインエリア - プロジェクト詳細 */}
      <div style={{ 
        flex: 1,
        position: 'relative'
      }}>
        {/* ヘッダーエリア */}
        <div style={{
          height: '168px',
          backgroundColor: 'rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 48px',
          position: 'relative'
        }}>
          {/* 検索バー */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: '29px',
            height: '58px',
            flex: 1,
            marginRight: '48px'
          }} />

          {/* ユーザーアバター群 */}
          <div style={{
            display: 'flex',
            gap: '16px'
          }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '59px',
                  height: '59px',
                  borderRadius: '50%',
                  backgroundColor: '#ccc'
                }}
              />
            ))}
          </div>
        </div>

        {selectedProject && (
          <>
            {/* プロジェクトタイトルとアバター */}
            <div style={{
              padding: '48px',
              display: 'flex',
              alignItems: 'center',
              gap: '32px'
            }}>
              <div style={{
                width: '94px',
                height: '94px',
                borderRadius: '50%',
                backgroundColor: '#ccc'
              }} />
              
              <div>
                <h1 style={{
                  fontSize: '40px',
                  color: 'white',
                  margin: 0,
                  fontWeight: 'normal'
                }}>
                  {selectedProject.title}
                </h1>
                <div style={{
                  fontSize: '16px',
                  color: '#a19f9f',
                  marginTop: '8px'
                }}>
                  1時間前
                </div>
              </div>
            </div>

            {/* プロジェクト詳細説明 */}
            <div style={{
              padding: '0 48px 48px',
              fontSize: '15px',
              color: 'white',
              lineHeight: '1.6'
            }}>
              <p>{selectedProject.description}</p>
            </div>

            {/* タグ一覧 */}
            <div style={{
              padding: '0 48px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '32px'
            }}>
              {selectedProject.required_skills?.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '11px',
                    padding: '4px 12px',
                    fontSize: '13px',
                    color: '#000'
                  }}
                >
                  #{skill}
                </span>
              ))}
            </div>
          </>
        )}

        {/* 右側チャットエリア */}
        <div style={{
          position: 'absolute',
          right: '48px',
          top: '378px',
          width: '303px',
          height: '262px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderRadius: '33px',
          padding: '24px'
        }}>
          {/* TODO: チャット機能を実装 */}
          
          {/* チャットメッセージ */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              backgroundColor: '#d9d9d9',
              borderRadius: '19.5px',
              padding: '12px 16px',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              チャットメッセージ例
            </div>
          </div>

          {/* メッセージ入力エリア */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '0 0 33px 33px',
            height: '54px',
            margin: '0 -24px -24px',
            position: 'relative'
          }}>
            <div style={{
              backgroundColor: '#d9d9d9',
              borderRadius: '10px',
              height: '28px',
              margin: '13px 16px',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '16px',
              fontSize: '12px',
              color: 'white'
            }}>
              メッセージを入力
            </div>
          </div>
        </div>

        {/* 右下管理ボタン群 */}
        <div style={{
          position: 'absolute',
          right: '48px',
          bottom: '48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            backgroundColor: '#d9d9d9',
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: '32px',
            color: '#000',
            cursor: 'pointer',
            textAlign: 'center'
          }}>
            編集
          </div>
          
          <div style={{
            backgroundColor: '#d9d9d9',
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: '32px',
            color: '#000',
            cursor: 'pointer',
            textAlign: 'center'
          }}>
            公開停止
          </div>
        </div>

        {/* メンバー管理エリア */}
        <div style={{
          position: 'absolute',
          right: '48px',
          top: '667px',
          width: '327px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* TODO: メンバー管理機能を実装 */}
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              gap: '16px'
            }}>
              <div style={{
                width: '31px',
                height: '31px',
                borderRadius: '50%',
                backgroundColor: '#ccc'
              }} />
              <span style={{
                fontSize: '16px',
                color: '#363a51'
              }}>
                ユーザー名
              </span>
              <div style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '15px'
                }}>
                  １
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminPage