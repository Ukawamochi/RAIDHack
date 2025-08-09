import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { Idea } from '../types/api'
import { useAuth } from '../features/auth'
import '../App.css'

function IndexPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'open' | 'development' | 'completed'>('all')
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    try {
      const response = await fetch('/api/ideas', {
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
        }
      })
      const data = await response.json()
      if (data.success) {
        setIdeas(data.ideas || [])
      }
    } catch (error) {
      console.error('Error fetching ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredIdeas = ideas.filter(idea => {
    if (filter === 'all') return true
    return idea.status === filter
  })

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>RAIDHack!</h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
          アイデアを投稿し、メンバーを募ってレイドでハッカソンを行うSNS
        </p>
        
        {isAuthenticated && (
          <Link 
            to="/new"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}
          >
            🚀 新しいアイデアを投稿
          </Link>
        )}
      </div>

      {/* ステータスフィルター */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'すべて' },
            { key: 'open' as const, label: '募集中' },
            { key: 'development' as const, label: '進行中' },
            { key: 'completed' as const, label: 'Done' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '20px',
                background: filter === key ? '#007bff' : 'white',
                color: filter === key ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* アイデア一覧 */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {filteredIdeas.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            {filter === 'all' ? 'アイデアがまだありません' : `${filter === 'open' ? '募集中' : filter === 'development' ? '進行中' : 'Done'}のアイデアがありません`}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredIdeas.map(idea => (
              <div
                key={idea.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>
                    <Link 
                      to={`/ideas/${idea.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {idea.title}
                    </Link>
                  </h3>
                  <StatusBadge status={idea.status} />
                </div>
                
                <p style={{ color: '#666', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                  {idea.description.length > 150 
                    ? `${idea.description.substring(0, 150)}...` 
                    : idea.description}
                </p>

                {idea.progress_percentage !== undefined && idea.status === 'development' && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                      進捗: {idea.progress_percentage}%
                    </div>
                    <div style={{ width: '100%', backgroundColor: '#e9ecef', borderRadius: '10px', height: '8px' }}>
                      <div 
                        style={{ 
                          width: `${idea.progress_percentage}%`, 
                          backgroundColor: '#007bff', 
                          borderRadius: '10px', 
                          height: '100%',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                )}

                {idea.deadline && idea.status === 'development' && (
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                    期限: {new Date(idea.deadline).toLocaleDateString('ja-JP')}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#666' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span>by {idea.username || 'Unknown'}</span>
                    {idea.like_count !== undefined && (
                      <span>👍 {idea.like_count}</span>
                    )}
                  </div>
                  <span>{new Date(idea.created_at).toLocaleDateString('ja-JP')}</span>
                </div>

                {idea.required_skills && idea.required_skills.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {idea.required_skills.map((skill, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#495057'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default IndexPage
