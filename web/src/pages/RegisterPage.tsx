import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import './AuthPages.css';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  skills: string[];
}

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    skills: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');

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

  const validateForm = (): string | null => {
    if (!formData.username.trim()) {
      return 'ユーザー名を入力してください';
    }
    if (formData.username.length < 3) {
      return 'ユーザー名は3文字以上で入力してください';
    }
    if (!formData.email.trim()) {
      return 'メールアドレスを入力してください';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return '有効なメールアドレスを入力してください';
    }
    if (!formData.password) {
      return 'パスワードを入力してください';
    }
    if (formData.password.length < 6) {
      return 'パスワードは6文字以上で入力してください';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'パスワードが一致しません';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        bio: formData.bio,
        skills: formData.skills
      });
      navigate('/top');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1>アカウント登録</h1>
            <p>RAIDHackに参加してハッカソンを始めよう</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">ユーザー名 *</label>
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
            </div>

            <div className="form-group">
              <label htmlFor="email">メールアドレス *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">パスワード *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="6文字以上で入力してください"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">パスワード確認 *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="パスワードを再入力してください"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">自己紹介</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="あなたについて教えてください（経験、興味のある技術など）"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>スキル</label>
              <div className="skills-input-area">
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
                      <span key={index} className="skill-tag">
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
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner small"></span>
                  登録中...
                </>
              ) : (
                'アカウント登録'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              既にアカウントをお持ちですか？{' '}
              <Link to="/login">ログイン</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
