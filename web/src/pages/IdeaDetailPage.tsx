import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { Idea } from '../types/api'
import { useAuth } from '../features/auth'

interface ProgressData {
  project: {
    id: number
    title: string
    status: string
    owner: string
    progress_percentage: number
  }
  timeline: {
    start_date?: string
    deadline?: string
    days_elapsed: number
    days_remaining: number
    total_days: number
  }
  activities: Array<{
    type: string
    description: string
    created_at: string
    created_by: string
  }>
  permissions: {
    can_update_progress: boolean
  }
}

function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [idea, setIdea] = useState<Idea | null>(null)
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showStatusForm, setShowStatusForm] = useState(false)
  const [showDeadlineForm, setShowDeadlineForm] = useState(false)
  const [showProgressForm, setShowProgressForm] = useState(false)
  const [newStatus, setNewStatus] = useState<'open' | 'development' | 'completed'>('open')
  const [newDeadline, setNewDeadline] = useState('')
  const [newProgress, setNewProgress] = useState(0)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (id) {
      fetchIdea()
      fetchProgress()
    }
  }, [id])

  const fetchIdea = async () => {
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
        }
      })
      const data = await response.json()
      if (data.success) {
        setIdea(data.idea)
      }
    } catch (error) {
      console.error('Error fetching idea:', error)
    }
  }

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/ideas/${id}/progress`, {
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
        }
      })
      const data = await response.json()
      if (data.success) {
        setProgress(data.progress)
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (status: 'open' | 'development' | 'completed') => {
    if (!idea || !isAuthenticated) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/ideas/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          status,
          start_date: status === 'development' ? new Date().toISOString() : undefined
        })
      })
      
      if (response.ok) {
        await fetchIdea()
        await fetchProgress()
        setShowStatusForm(false)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const updateDeadline = async () => {
    if (!idea || !isAuthenticated || !newDeadline) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/ideas/${id}/deadline`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ deadline: newDeadline })
      })
      
      if (response.ok) {
        await fetchIdea()
        await fetchProgress()
        setShowDeadlineForm(false)
        setNewDeadline('')
      }
    } catch (error) {
      console.error('Error updating deadline:', error)
    } finally {
      setUpdating(false)
    }
  }

  const updateProgress = async () => {
    if (!idea || !isAuthenticated) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/ideas/${id}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ progress_percentage: newProgress })
      })
      
      if (response.ok) {
        await fetchIdea()
        await fetchProgress()
        setShowProgressForm(false)
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </div>
    )
  }

  if (!idea) {
    return <Navigate to="/404" replace />
  }

  const isOwner = user && idea.user_id === user.id
  const canManage = isOwner

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '32px', color: '#333' }}>{idea.title}</h1>
          <StatusBadge status={idea.status} />
        </div>

        <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          作成者: {idea.username || 'Unknown'} | 
          作成日: {new Date(idea.created_at).toLocaleDateString('ja-JP')}
        </div>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333', marginBottom: '24px' }}>
          {idea.description}
        </p>

        {idea.required_skills && idea.required_skills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#333' }}>必要なスキル</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {idea.required_skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '16px',
                    fontSize: '14px',
                    color: '#495057'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* プロジェクト管理セクション */}
      {canManage && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '24px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#333' }}>プロジェクト管理</h3>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <button
              onClick={() => setShowStatusForm(true)}
              disabled={updating}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: updating ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              ステータス変更
            </button>

            {idea.status === 'development' && (
              <>
                <button
                  onClick={() => setShowDeadlineForm(true)}
                  disabled={updating}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: updating ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  期限設定
                </button>

                <button
                  onClick={() => {
                    setNewProgress(idea.progress_percentage || 0)
                    setShowProgressForm(true)
                  }}
                  disabled={updating}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffc107',
                    color: 'black',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: updating ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  進捗更新
                </button>
              </>
            )}
          </div>

          {/* ステータス変更フォーム */}
          {showStatusForm && (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '16px', 
              borderRadius: '6px', 
              border: '1px solid #ddd',
              marginBottom: '16px'
            }}>
              <h4 style={{ margin: '0 0 12px 0' }}>ステータスを変更</h4>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {[
                  { value: 'open' as const, label: '募集中' },
                  { value: 'development' as const, label: '進行中' },
                  { value: 'completed' as const, label: 'Done' }
                ].map(({ value, label }) => (
                  <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="radio"
                      value={value}
                      checked={newStatus === value}
                      onChange={(e) => setNewStatus(e.target.value as typeof value)}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => updateStatus(newStatus)}
                  disabled={updating}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  更新
                </button>
                <button
                  onClick={() => setShowStatusForm(false)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}

          {/* 期限設定フォーム */}
          {showDeadlineForm && (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '16px', 
              borderRadius: '6px', 
              border: '1px solid #ddd',
              marginBottom: '16px'
            }}>
              <h4 style={{ margin: '0 0 12px 0' }}>期限を設定</h4>
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="datetime-local"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  style={{
                    padding: '6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    width: '200px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={updateDeadline}
                  disabled={updating || !newDeadline}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: !newDeadline ? 'not-allowed' : 'pointer'
                  }}
                >
                  設定
                </button>
                <button
                  onClick={() => {
                    setShowDeadlineForm(false)
                    setNewDeadline('')
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}

          {/* 進捗更新フォーム */}
          {showProgressForm && (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '16px', 
              borderRadius: '6px', 
              border: '1px solid #ddd',
              marginBottom: '16px'
            }}>
              <h4 style={{ margin: '0 0 12px 0' }}>進捗を更新 ({newProgress}%)</h4>
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  style={{ width: '200px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={updateProgress}
                  disabled={updating}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ffc107',
                    color: 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  更新
                </button>
                <button
                  onClick={() => setShowProgressForm(false)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 進捗情報セクション */}
      {progress && idea.status === 'development' && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#333' }}>プロジェクト進捗</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>進捗率</span>
              <span>{progress.project.progress_percentage}%</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#e9ecef', borderRadius: '10px', height: '12px' }}>
              <div 
                style={{ 
                  width: `${progress.project.progress_percentage}%`, 
                  backgroundColor: '#007bff', 
                  borderRadius: '10px', 
                  height: '100%',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          {progress.timeline.start_date && progress.timeline.deadline && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: '16px',
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              <div>
                <div style={{ color: '#666', marginBottom: '4px' }}>開始日</div>
                <div>{new Date(progress.timeline.start_date).toLocaleDateString('ja-JP')}</div>
              </div>
              <div>
                <div style={{ color: '#666', marginBottom: '4px' }}>期限</div>
                <div>{new Date(progress.timeline.deadline).toLocaleDateString('ja-JP')}</div>
              </div>
              <div>
                <div style={{ color: '#666', marginBottom: '4px' }}>経過日数</div>
                <div>{progress.timeline.days_elapsed}日</div>
              </div>
              <div>
                <div style={{ color: '#666', marginBottom: '4px' }}>残り日数</div>
                <div style={{ color: progress.timeline.days_remaining <= 3 ? '#dc3545' : '#333' }}>
                  {progress.timeline.days_remaining}日
                </div>
              </div>
            </div>
          )}

          {progress.activities.length > 0 && (
            <div>
              <h4 style={{ fontSize: '16px', marginBottom: '12px', color: '#333' }}>最近の活動</h4>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {progress.activities.map((activity, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      padding: '8px 12px', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '4px', 
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <div style={{ marginBottom: '4px' }}>{activity.description}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {activity.created_by} - {new Date(activity.created_at).toLocaleString('ja-JP')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default IdeaDetailPage