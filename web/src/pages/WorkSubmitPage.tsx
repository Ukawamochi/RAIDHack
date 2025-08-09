import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './WorkSubmitPage.css';

const API_BASE = import.meta.env.API_BASE || 'http://localhost:8787';

interface Team {
  id: number;
  name: string;
  description: string;
  status: string;
  members: Array<{
    id: number;
    username: string;
    email: string;
  }>;
}

const WorkSubmitPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [] as string[],
    liveUrl: '',
    githubUrl: '',
    imageUrl: '',
    selectedTeamId: ''
  });
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    if (user) {
      fetchMyTeams();
    }
  }, [user]);

  const fetchMyTeams = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/teams/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTeams(data.teams.filter((team: Team) => team.status === 'active'));
        } else {
          setError(data.message || 'チーム一覧の取得に失敗しました');
        }
      } else {
        setError('チーム一覧の取得に失敗しました');
      }
    } catch {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.selectedTeamId) {
      setError('チームを選択してください');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const selectedTeam = teams.find(team => team.id.toString() === formData.selectedTeamId);
      const teamMemberIds = selectedTeam?.members.map(member => member.id) || [];

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/works`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          technologies: formData.technologies,
          liveUrl: formData.liveUrl || undefined,
          githubUrl: formData.githubUrl || undefined,
          imageUrl: formData.imageUrl || undefined,
          teamMemberIds: teamMemberIds
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('作品が投稿されました！');
        navigate('/works');
      } else {
        setError(data.message || '作品の投稿に失敗しました');
      }
    } catch {
      setError('ネットワークエラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleTechKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTechnology();
    }
  };

  if (!user) {
    return (
      <div className="work-submit-page">
        <div className="auth-required">
          <p>ログインが必要です</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (teams.length === 0) {
    return (
      <div className="work-submit-page">
        <div className="no-teams">
          <h2>アクティブなチームがありません</h2>
          <p>作品を投稿するには、まずチームに参加する必要があります。</p>
          <button onClick={() => navigate('/teams')} className="btn btn-primary">
            チーム一覧へ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="work-submit-page">
      <div className="page-header">
        <h1>作品投稿</h1>
        <p>あなたのチームが開発した作品を投稿しましょう</p>
      </div>

      <div className="submit-container">
        <form onSubmit={handleSubmit} className="submit-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="team">チーム選択 *</label>
            <select
              id="team"
              value={formData.selectedTeamId}
              onChange={(e) => setFormData(prev => ({ ...prev, selectedTeamId: e.target.value }))}
              required
            >
              <option value="">チームを選択してください</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} ({team.members.length}人)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">作品タイトル *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="作品のタイトルを入力"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">作品説明 *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="作品の概要、機能、特徴などを詳しく説明してください"
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="technologies">使用技術</label>
            <div className="tech-input-container">
              <input
                type="text"
                id="technologies"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={handleTechKeyPress}
                placeholder="技術名を入力してEnterキー"
              />
              <button
                type="button"
                onClick={handleAddTechnology}
                className="btn btn-outline"
                disabled={!techInput.trim()}
              >
                追加
              </button>
            </div>
            <div className="tech-tags">
              {formData.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTechnology(tech)}
                    className="tech-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="liveUrl">デモURL</label>
            <input
              type="url"
              id="liveUrl"
              value={formData.liveUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="githubUrl">GitHub URL</label>
            <input
              type="url"
              id="githubUrl"
              value={formData.githubUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">スクリーンショット URL</label>
            <input
              type="url"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="作品のスクリーンショット画像URL"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/works')}
              className="btn btn-outline"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? '投稿中...' : '作品を投稿'}
            </button>
          </div>
        </form>

        {formData.selectedTeamId && (
          <div className="team-preview">
            <h3>選択されたチーム</h3>
            {teams
              .filter(team => team.id.toString() === formData.selectedTeamId)
              .map(team => (
                <div key={team.id} className="team-card">
                  <h4>{team.name}</h4>
                  <p>{team.description}</p>
                  <div className="team-members">
                    <span className="members-label">メンバー:</span>
                    {team.members.map((member, index) => (
                      <span key={member.id}>
                        {member.username}
                        {index < team.members.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkSubmitPage;
