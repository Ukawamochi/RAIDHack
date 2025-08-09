import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './IdeaDetailPage.css';

const API_BASE = import.meta.env.API_BASE || 'http://localhost:8787';

interface Idea {
  id: number;
  title: string;
  description: string;
  required_skills: string[];
  user_id: number;
  status: 'open' | 'development' | 'completed';
  created_at: string;
  updated_at: string;
  username?: string;
  avatar_url?: string;
  like_count?: number;
  user_liked?: boolean;
}

interface Application {
  id: number;
  message: string;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  reviewed_at?: string;
  applicant: {
    id: number;
    username: string;
    email: string;
    bio?: string;
    skills: string[];
    avatar_url?: string;
  };
}

const IdeaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    message: '',
    motivation: ''
  });

  const fetchIdeaDetail = React.useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/ideas/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIdea(data.idea);
        } else {
          setError(data.message || 'アイデアの取得に失敗しました');
        }
      } else {
        setError('アイデアが見つかりません');
      }
    } catch (err) {
      console.error('Fetch idea error:', err);
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchApplications = React.useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/ideas/${id}/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setApplications(data.applications);
        }
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchIdeaDetail();
    }
  }, [id, fetchIdeaDetail]);

  useEffect(() => {
    if (user && idea && idea.user_id === user.id) {
      fetchApplications();
    }
  }, [user, idea, fetchApplications]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setApplyLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/ideas/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();
      if (data.success) {
        setShowApplicationForm(false);
        setApplicationData({ message: '', motivation: '' });
        alert('応募を送信しました');
        // 再読み込み
        fetchIdeaDetail();
      } else {
        alert(data.message || '応募に失敗しました');
      }
    } catch {
      alert('ネットワークエラーが発生しました');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/ideas/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        fetchIdeaDetail(); // いいね数を更新
      }
    } catch (_err) {
      console.error('Failed to like:', _err);
    }
  };

  const handleApplicationReview = async (applicationId: number, action: 'approve' | 'reject', message: string = '') => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/ideas/${id}/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action, message }),
      });

      const data = await response.json();
      if (data.success) {
        alert(action === 'approve' ? '応募を承認しました' : '応募を拒否しました');
        fetchApplications(); // 応募一覧を更新
      } else {
        alert(data.message || '処理に失敗しました');
      }
    } catch {
      alert('ネットワークエラーが発生しました');
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!idea) {
    return <div className="error">アイデアが見つかりません</div>;
  }

  const isMyIdea = user && user.id === idea.user_id;
  const canApply = user && !isMyIdea && idea.status === 'open';

  return (
    <div className="idea-detail-page">
      <div className="idea-detail-container">
        {/* アイデア詳細 */}
        <div className="idea-detail-header">
          <div className="idea-meta">
            <div className="author-info">
              <div className="author-avatar">
                {idea.avatar_url ? (
                  <img src={idea.avatar_url} alt={idea.username} />
                ) : (
                  <span>{idea.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="author-details">
                <h3>{idea.username}</h3>
                <p>{new Date(idea.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="idea-status">
              <span className={`status-badge ${idea.status}`}>
                {idea.status === 'open' ? '募集中' : 
                 idea.status === 'development' ? '開発中' : '完了'}
              </span>
            </div>
          </div>

          <h1 className="idea-title">{idea.title}</h1>
          <p className="idea-description">{idea.description}</p>

          <div className="required-skills">
            <h4>必要なスキル</h4>
            <div className="skills-list">
              {idea.required_skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="idea-actions">
            <button
              onClick={handleLike}
              className={`btn btn-like ${idea.user_liked ? 'liked' : ''}`}
              disabled={!user}
            >
              ❤️ {idea.like_count || 0}
            </button>

            {canApply && (
              <button
                onClick={() => setShowApplicationForm(true)}
                className="btn btn-primary"
              >
                応募する
              </button>
            )}
          </div>
        </div>

        {/* 応募フォーム */}
        {showApplicationForm && (
          <div className="application-form">
            <h3>応募フォーム</h3>
            <div className="form-group">
              <label htmlFor="message">メッセージ</label>
              <textarea
                id="message"
                value={applicationData.message}
                onChange={(e) => setApplicationData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="なぜこのプロジェクトに参加したいのか、簡潔にお書きください"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label htmlFor="motivation">意気込み</label>
              <textarea
                id="motivation"
                value={applicationData.motivation}
                onChange={(e) => setApplicationData(prev => ({ ...prev, motivation: e.target.value }))}
                placeholder="プロジェクトに対する意気込みや貢献できることをお書きください"
                rows={3}
              />
            </div>
            <div className="form-actions">
              <button
                onClick={() => setShowApplicationForm(false)}
                className="btn btn-outline"
              >
                キャンセル
              </button>
              <button
                onClick={handleApply}
                className="btn btn-primary"
                disabled={applyLoading}
              >
                {applyLoading ? '送信中...' : '応募する'}
              </button>
            </div>
          </div>
        )}

        {/* 応募一覧（アイデア作成者のみ） */}
        {isMyIdea && applications.length > 0 && (
          <div className="applications-section">
            <h3>応募一覧</h3>
            {applications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="applicant-info">
                  <div className="applicant-avatar">
                    {app.applicant.avatar_url ? (
                      <img src={app.applicant.avatar_url} alt={app.applicant.username} />
                    ) : (
                      <span>{app.applicant.username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="applicant-details">
                    <h4>{app.applicant.username}</h4>
                    <p>{app.applicant.bio}</p>
                    <div className="applicant-skills">
                      {app.applicant.skills.map((skill, index) => (
                        <span key={index} className="skill-tag small">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="application-status">
                    <span className={`status-badge ${app.status}`}>
                      {app.status === 'pending' ? '審査中' :
                       app.status === 'approved' ? '承認済み' : '拒否'}
                    </span>
                  </div>
                </div>

                <div className="application-content">
                  <div className="application-message">
                    <h5>メッセージ</h5>
                    <p>{app.message}</p>
                  </div>
                  <div className="application-motivation">
                    <h5>意気込み</h5>
                    <p>{app.motivation}</p>
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div className="application-actions">
                    <button
                      onClick={() => handleApplicationReview(app.id, 'approve')}
                      className="btn btn-success"
                    >
                      承認
                    </button>
                    <button
                      onClick={() => handleApplicationReview(app.id, 'reject')}
                      className="btn btn-danger"
                    >
                      拒否
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaDetailPage;
