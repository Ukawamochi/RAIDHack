import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './TeamsPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

interface Team {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'disbanded';
  discord_url?: string;
  created_at: string;
  idea: {
    id: number;
    title: string;
    description: string;
  };
  leader: {
    id: number;
    username: string;
    email: string;
    avatar_url?: string;
  };
  members: Array<{
    id: number;
    username: string;
    email: string;
    avatar_url?: string;
    joined_at: string;
  }>;
}

const TeamsPage: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchMyTeams();
    }
  }, [user]);

  const fetchMyTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/teams/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTeams(data.teams);
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

  const updateDiscordUrl = async (teamId: number, discordUrl: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/teams/${teamId}/discord`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ discord_url: discordUrl }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Discord URLが更新されました');
        fetchMyTeams(); // チーム一覧を更新
      } else {
        alert(data.message || 'Discord URLの更新に失敗しました');
      }
    } catch {
      alert('ネットワークエラーが発生しました');
    }
  };

  const disbandTeam = async (teamId: number) => {
    if (!confirm('本当にチームを解散しますか？この操作は取り消せません。')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('チームを解散しました');
        fetchMyTeams(); // チーム一覧を更新
      } else {
        alert(data.message || 'チームの解散に失敗しました');
      }
    } catch {
      alert('ネットワークエラーが発生しました');
    }
  };

  if (!user) {
    return (
      <div className="teams-page">
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
    <div className="teams-page">
      <div className="page-header">
        <h1>マイチーム</h1>
        <p>参加しているチームの一覧です</p>
      </div>

      {teams.length === 0 ? (
        <div className="empty-state">
          <h3>参加中のチームがありません</h3>
          <p>アイデアに応募してチームに参加しましょう</p>
          <div className="empty-actions">
            <Link to="/ideas" className="btn btn-primary">アイデアを探す</Link>
            <Link to="/applications" className="btn btn-outline">応募履歴を確認</Link>
          </div>
        </div>
      ) : (
        <div className="teams-list">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              currentUser={user}
              onUpdateDiscord={updateDiscordUrl}
              onDisband={disbandTeam}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface TeamCardProps {
  team: Team;
  currentUser: {
    id: number;
    username: string;
    email: string;
  };
  onUpdateDiscord: (teamId: number, discordUrl: string) => void;
  onDisband: (teamId: number) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, currentUser, onUpdateDiscord, onDisband }) => {
  const [showDiscordForm, setShowDiscordForm] = useState(false);
  const [discordUrl, setDiscordUrl] = useState(team.discord_url || '');

  const isLeader = currentUser.id === team.leader.id;

  const handleDiscordUpdate = () => {
    onUpdateDiscord(team.id, discordUrl);
    setShowDiscordForm(false);
  };

  return (
    <div className="team-card">
      <div className="team-header">
        <div className="team-info">
          <h3>{team.name}</h3>
          <p className="team-description">{team.description}</p>
          <div className="team-meta">
            <span className={`status-badge ${team.status}`}>
              {team.status === 'active' ? 'アクティブ' :
               team.status === 'completed' ? '完了' : '解散'}
            </span>
            <span className="created-date">
              作成日: {new Date(team.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="related-idea">
        <h4>関連アイデア</h4>
        <Link to={`/ideas/${team.idea.id}`} className="idea-link">
          <h5>{team.idea.title}</h5>
          <p>{team.idea.description}</p>
        </Link>
      </div>

      <div className="team-members">
        <h4>チームメンバー</h4>
        <div className="leader-section">
          <h5>リーダー</h5>
          <div className="member-item leader">
            <div className="member-avatar">
              {team.leader.avatar_url ? (
                <img src={team.leader.avatar_url} alt={team.leader.username} />
              ) : (
                <span>{team.leader.username.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="member-info">
              <p className="member-name">{team.leader.username}</p>
              <p className="member-email">{team.leader.email}</p>
            </div>
            <span className="leader-badge">リーダー</span>
          </div>
        </div>

        {team.members.length > 0 && (
          <div className="members-section">
            <h5>メンバー</h5>
            {team.members.map((member) => (
              <div key={member.id} className="member-item">
                <div className="member-avatar">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt={member.username} />
                  ) : (
                    <span>{member.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="member-info">
                  <p className="member-name">{member.username}</p>
                  <p className="member-email">{member.email}</p>
                  <p className="joined-date">
                    参加日: {new Date(member.joined_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {team.discord_url && (
        <div className="discord-section">
          <h4>Discord</h4>
          <a href={team.discord_url} target="_blank" rel="noopener noreferrer" className="discord-link">
            チームのDiscordサーバーに参加
          </a>
        </div>
      )}

      {isLeader && team.status === 'active' && (
        <div className="team-actions">
          <button
            onClick={() => setShowDiscordForm(!showDiscordForm)}
            className="btn btn-outline"
          >
            Discord URL設定
          </button>
          <button
            onClick={() => onDisband(team.id)}
            className="btn btn-danger"
          >
            チーム解散
          </button>
        </div>
      )}

      {showDiscordForm && (
        <div className="discord-form">
          <h5>Discord URL設定</h5>
          <input
            type="url"
            value={discordUrl}
            onChange={(e) => setDiscordUrl(e.target.value)}
            placeholder="https://discord.gg/..."
            className="discord-input"
          />
          <div className="form-actions">
            <button
              onClick={() => setShowDiscordForm(false)}
              className="btn btn-outline"
            >
              キャンセル
            </button>
            <button
              onClick={handleDiscordUpdate}
              className="btn btn-primary"
            >
              更新
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
