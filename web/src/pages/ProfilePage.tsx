import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import './ProfilePage.css';

interface ProfileFormData {
  username: string;
  email: string;
  bio: string;
  skills: string[];
}

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    skills: user?.skills || []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username.trim()) {
      setError('ユーザー名を入力してください');
      return;
    }

    if (formData.username.length < 3) {
      setError('ユーザー名は3文字以上で入力してください');
      return;
    }

    setLoading(true);

    try {
      await updateProfile({
        username: formData.username,
        bio: formData.bio,
        skills: formData.skills
      });
      setSuccess('プロフィールを更新しました');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プロフィールの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      skills: user?.skills || []
    });
    setError('');
    setSuccess('');
    setIsEditing(false);
  };

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-avatar">
                <span className="avatar-text">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="profile-details">
                <h1>{user?.username}</h1>
                <p className="profile-email">{user?.email}</p>
              </div>
            </div>
            <div className="profile-actions">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  プロフィール編集
                </button>
              ) : (
                <div className="edit-actions">
                  <button
                    onClick={handleCancel}
                    className="btn btn-outline"
                    disabled={loading}
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner small"></span>
                        保存中...
                      </>
                    ) : (
                      '保存'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {success}
            </div>
          )}

          <div className="profile-content">
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h2>基本情報</h2>
                
                <div className="form-group">
                  <label htmlFor="username">ユーザー名</label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="3文字以上で入力してください"
                      disabled={loading}
                      required
                    />
                  ) : (
                    <div className="form-display">{formData.username}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">メールアドレス</label>
                  <div className="form-display disabled">
                    {formData.email}
                    <span className="field-note">メールアドレスは変更できません</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">自己紹介</label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="あなたについて教えてください（経験、興味のある技術など）"
                      disabled={loading}
                      rows={4}
                    />
                  ) : (
                    <div className="form-display">
                      {formData.bio || '自己紹介が設定されていません'}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h2>スキル</h2>
                
                {isEditing ? (
                  <div className="skills-edit-area">
                    <div className="skills-input-container">
                      <input
                        type="text"
                        className="skills-input"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={handleSkillKeyPress}
                        placeholder="スキルを入力（例: React, Python, UI/UX）"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="add-skill-btn"
                        onClick={addSkill}
                        disabled={loading || !skillInput.trim()}
                      >
                        追加
                      </button>
                    </div>
                    
                    {formData.skills.length > 0 && (
                      <div className="skills-list">
                        {formData.skills.map((skill, index) => (
                          <span key={index} className="skill-tag editable">
                            {skill}
                            <button
                              type="button"
                              className="skill-remove"
                              onClick={() => removeSkill(skill)}
                              disabled={loading}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="skills-display">
                    {formData.skills.length > 0 ? (
                      <div className="skills-list">
                        {formData.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    ) : (
                      <div className="form-display">スキルが設定されていません</div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* 統計情報 */}
          <div className="profile-stats">
            <h2>活動統計</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">投稿したアイデア</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">参加したプロジェクト</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">完成した作品</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">獲得した票数</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
