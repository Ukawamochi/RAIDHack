import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './ApplicationsPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

interface Application {
  id: number;
  idea_id: number;
  message: string;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  reviewed_at?: string;
  idea: {
    title: string;
    description: string;
    username: string;
  };
}

const ApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchMyApplications();
    }
  }, [user]);

  const fetchMyApplications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/applications/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setApplications(data.applications);
        } else {
          setError(data.message || '応募履歴の取得に失敗しました');
        }
      } else {
        setError('応募履歴の取得に失敗しました');
      }
    } catch {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (applicationId: number) => {
    if (!confirm('チームを作成しますか？\n承認されたメンバーと一緒にプロジェクトを開始できます。')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/applications/${applicationId}/create-team`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('チームが作成されました！');
        // 応募一覧を更新
        fetchMyApplications();
      } else {
        alert(data.message || 'チームの作成に失敗しました');
      }
    } catch {
      alert('ネットワークエラーが発生しました');
    }
  };

  if (!user) {
    return (
      <div className="applications-page">
        <div className="auth-required">
          <p>ログインが必要です</p>
          <Link to="/login" className="btn btn-primary">ログイン</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="applications-page">
      <div className="page-header">
        <h1>応募履歴</h1>
        <p>あなたが応募したアイデアの一覧です</p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <h3>応募履歴がありません</h3>
          <p>興味のあるアイデアに応募してみましょう</p>
          <Link to="/ideas" className="btn btn-primary">アイデアを探す</Link>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="application-header">
                <div className="application-info">
                  <h3>
                    <Link to={`/ideas/${app.idea_id}`} className="idea-link">
                      {app.idea.title}
                    </Link>
                  </h3>
                  <p className="idea-author">by {app.idea.username}</p>
                  <p className="applied-date">
                    応募日: {new Date(app.applied_at).toLocaleDateString()}
                  </p>
                  {app.reviewed_at && (
                    <p className="reviewed-date">
                      審査日: {new Date(app.reviewed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="application-status">
                  <span className={`status-badge ${app.status}`}>
                    {app.status === 'pending' ? '審査中' :
                     app.status === 'approved' ? '承認済み' : '拒否'}
                  </span>
                </div>
              </div>

              <div className="application-content">
                <div className="application-section">
                  <h4>応募メッセージ</h4>
                  <p>{app.message}</p>
                </div>
                <div className="application-section">
                  <h4>意気込み</h4>
                  <p>{app.motivation}</p>
                </div>
              </div>

              {app.status === 'approved' && (
                <div className="application-actions">
                  <button
                    onClick={() => createTeam(app.id)}
                    className="btn btn-primary"
                  >
                    チームを作成
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
