import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './TopPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

interface Idea {
  id: number;
  title: string;
  description: string;
  requiredSkills: string[];
  status: 'open' | 'development' | 'completed';
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  likeCount: number;
  userLiked: boolean;
}

interface Work {
  id: number;
  title: string;
  description: string;
  teamMembers: string[];
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  voteCount: number;
  userVoted: boolean;
}

const TopPage: React.FC = () => {
  const { user } = useAuth();
  
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'ideas' | 'works'>('ideas');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // アイデア一覧を取得
      const ideasResponse = await fetch(`${API_BASE}/api/ideas`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // 作品一覧を取得
      const worksResponse = await fetch(`${API_BASE}/api/works`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (ideasResponse.ok) {
        const ideasData = await ideasResponse.json();
        setIdeas(ideasData.ideas || []);
      }

      if (worksResponse.ok) {
        const worksData = await worksResponse.json();
        setWorks(worksData.works || []);
      }
    } catch (err) {
      console.error('データの取得に失敗しました:', err);
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (workId: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/works/${workId}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // 投票状態を更新
        setWorks(works.map(work => 
          work.id === workId 
            ? { 
                ...work, 
                voteCount: work.userVoted ? work.voteCount - 1 : work.voteCount + 1,
                userVoted: !work.userVoted
              }
            : work
        ));
      }
    } catch (err) {
      console.error('投票に失敗しました:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="status-badge recruiting">募集中</span>;
      case 'development':
        return <span className="status-badge in-progress">開発中</span>;
      case 'completed':
        return <span className="status-badge completed">完成</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
        <p>データを読み込み中...</p>
      </div>
    );
  }

  return (
    <>
      <div className="top-page">
        <div className="top-container">
          {/* ヘッダーセクション */}
          <div className="top-header">
            <div className="welcome-section">
              <h1>おかえりなさい、{user?.username}さん</h1>
              <p>新しいアイデアを見つけて、素晴らしいプロダクトを作りましょう</p>
            </div>
            <div className="action-buttons">
              <Link to="/create" className="btn btn-primary">
                アイデア投稿
              </Link>
              
              <Link to="/discord" className="btn btn-outline">
                Discord
              </Link>

            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* タブナビゲーション */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'ideas' ? 'active' : ''}`}
              onClick={() => setActiveTab('ideas')}
            >
              アイデア一覧
              <span className="tab-count">{ideas.length}</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'works' ? 'active' : ''}`}
              onClick={() => setActiveTab('works')}
            >
              作品一覧
              <span className="tab-count">{works.length}</span>
            </button>
          </div>

          {/* アイデア一覧 */}
          {activeTab === 'ideas' && (
            <div className="ideas-section">
              {ideas.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💡</div>
                  <h3>まだアイデアがありません</h3>
                  <p>最初のアイデアを投稿してハッカソンを始めましょう</p>
                  <Link to="/create" className="btn btn-primary">
                    アイデアを投稿
                  </Link>
                </div>
              ) : (
                <div className="ideas-grid">
                  {ideas.map((idea) => (
                    <div key={idea.id} className="idea-card">
                      <div className="idea-header">
                        <h3>{idea.title}</h3>
                        {getStatusBadge(idea.status)}
                      </div>
                      <p className="idea-description">{idea.description}</p>
                      <div className="idea-technologies">
                        {idea.requiredSkills.map((tech, index) => (
                          <span key={index} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                      <div className="idea-footer">
                        <div className="idea-info">
                          <span className="created-by">by {idea.user.username}</span>
                          <span className="created-date">{formatDate(idea.createdAt)}</span>
                        </div>
                        <div className="idea-stats">
                          <span className="application-count">
                            ❤️ {idea.likeCount}
                          </span>
                        </div>
                      </div>
                      <div className="idea-actions">
                        
                        <Link 
                          to={`/ideas/${idea.id}`} 
                          className="btn btn-outline"
                        >
                          詳細を見る
                        </Link>
                        {idea.status === 'open' && (
                          <button className="btn btn-primary">
                            参加申請
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 作品一覧 */}
          {activeTab === 'works' && (
            <div className="works-section">
              {works.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🎨</div>
                  <h3>まだ作品がありません</h3>
                  <p>チームでプロダクトを完成させて作品を公開しましょう</p>
                </div>
              ) : (
                <div className="works-grid">
                  {works.map((work) => (
                    <div key={work.id} className="work-card">
                      {work.imageUrl && (
                        <div className="work-image">
                          <img src={work.imageUrl} alt={work.title} />
                        </div>
                      )}
                      <div className="work-content">
                        <h3>{work.title}</h3>
                        <p className="work-description">{work.description}</p>
                        <div className="work-team">
                          <span className="team-label">チーム:</span>
                          {work.teamMembers.map((member, index) => (
                            <span key={index} className="team-member">{member}</span>
                          ))}
                        </div>
                        <div className="work-technologies">
                          {work.technologies.map((tech, index) => (
                            <span key={index} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                        <div className="work-actions">
                          <div className="work-links">
                            {work.liveUrl && (
                              <a 
                                href={work.liveUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                              >
                                デモを見る
                              </a>
                            )}
                            {work.githubUrl && (
                              <a 
                                href={work.githubUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                              >
                                GitHub
                              </a>
                            )}
                          </div>
                          <button
                            onClick={() => handleVote(work.id)}
                            className={`vote-button ${work.userVoted ? 'voted' : ''}`}
                          >
                            {work.userVoted ? '❤️' : '🤍'} {work.voteCount}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TopPage;
