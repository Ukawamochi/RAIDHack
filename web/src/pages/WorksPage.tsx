import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './WorksPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

interface Work {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
  teamMembers: Array<{
    id: number;
    username: string;
    avatarUrl?: string;
  }>;
  voteCount: number;
  userVoted: boolean;
}

const WorksPage: React.FC = () => {
  const { user } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votingId, setVotingId] = useState<number | null>(null);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/works`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWorks(data.works);
        } else {
          setError(data.message || '作品一覧の取得に失敗しました');
        }
      } else {
        setError('作品一覧の取得に失敗しました');
      }
    } catch {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (workId: number) => {
    if (!user) return;

    setVotingId(workId);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/works/${workId}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // 作品一覧を更新
          setWorks(prevWorks =>
            prevWorks.map(work =>
              work.id === workId
                ? {
                    ...work,
                    voteCount: data.voted ? work.voteCount + 1 : work.voteCount - 1,
                    userVoted: data.voted
                  }
                : work
            )
          );
        } else {
          alert(data.message || '投票に失敗しました');
        }
      } else {
        alert('投票に失敗しました');
      }
    } catch {
      alert('ネットワークエラーが発生しました');
    } finally {
      setVotingId(null);
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="works-page">
      <div className="page-header">
        <div className="header-content">
          <h1>作品一覧</h1>
          <p>ハッカソンで生まれた素晴らしい作品たち</p>
        </div>
        <div className="header-actions">
          <Link to="/works/submit" className="btn btn-primary">
            作品を投稿
          </Link>
        </div>
      </div>

      {works.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎨</div>
          <h3>まだ作品がありません</h3>
          <p>最初の作品を投稿してみましょう</p>
          <Link to="/works/submit" className="btn btn-primary">
            作品を投稿
          </Link>
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
                <h3 className="work-title">{work.title}</h3>
                <p className="work-description">{work.description}</p>
                
                <div className="work-technologies">
                  {work.technologies.slice(0, 4).map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                  {work.technologies.length > 4 && (
                    <span className="tech-more">+{work.technologies.length - 4}</span>
                  )}
                </div>

                <div className="work-team">
                  <span className="team-label">チーム:</span>
                  <div className="team-members">
                    {work.teamMembers.slice(0, 3).map((member) => (
                      <div key={member.id} className="team-member">
                        <div className="member-avatar">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.username} />
                          ) : (
                            <span>{member.username.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <span className="member-name">{member.username}</span>
                      </div>
                    ))}
                    {work.teamMembers.length > 3 && (
                      <span className="team-more">+{work.teamMembers.length - 3}</span>
                    )}
                  </div>
                </div>

                <div className="work-meta">
                  <span className="work-date">
                    {new Date(work.createdAt).toLocaleDateString()}
                  </span>
                </div>
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
                      🌐 デモ
                    </a>
                  )}
                  {work.githubUrl && (
                    <a
                      href={work.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      📁 GitHub
                    </a>
                  )}
                </div>

                <div className="work-vote">
                  {user ? (
                    <button
                      onClick={() => handleVote(work.id)}
                      className={`btn btn-vote ${work.userVoted ? 'voted' : ''}`}
                      disabled={votingId === work.id}
                    >
                      {votingId === work.id ? (
                        '...'
                      ) : (
                        <>
                          {work.userVoted ? '❤️' : '🤍'} {work.voteCount}
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="vote-info">
                      ❤️ {work.voteCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorksPage;
