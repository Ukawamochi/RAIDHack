import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import './CreateIdeaPage.css';

interface IdeaFormData {
  title: string;
  description: string;
  technologies: string[];
  category: string;
  teamSize: number;
  duration: string;
  requirements: string;
}

const categories = [
  'Webアプリケーション',
  'モバイルアプリ',
  'AIツール',
  'ゲーム',
  'IoTデバイス',
  'データ分析',
  'ブロックチェーン',
  'VR/AR',
  'その他'
];

const durations = [
  '1日',
  '2-3日',
  '1週間',
  '2週間',
  '1ヶ月',
  'その他'
];

const CreateIdeaPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    technologies: [],
    category: '',
    teamSize: 2,
    duration: '',
    requirements: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [techInput, setTechInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'teamSize' ? parseInt(value) || 1 : value
    }));
  };

  const addTechnology = () => {
    const tech = techInput.trim();
    if (tech && !formData.technologies.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleTechKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return 'アイデアのタイトルを入力してください';
    }
    if (formData.title.length < 5) {
      return 'タイトルは5文字以上で入力してください';
    }
    if (!formData.description.trim()) {
      return 'アイデアの説明を入力してください';
    }
    if (formData.description.length < 20) {
      return '説明は20文字以上で入力してください';
    }
    if (!formData.category) {
      return 'カテゴリを選択してください';
    }
    if (!formData.duration) {
      return '開発期間を選択してください';
    }
    if (formData.teamSize < 1 || formData.teamSize > 10) {
      return 'チームサイズは1〜10人で設定してください';
    }
    if (formData.technologies.length === 0) {
      return '少なくとも1つの技術スタックを追加してください';
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
      const response = await fetch('http://localhost:8787/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          createdBy: user?.username
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'アイデアの投稿に失敗しました');
      }

      const ideaData = await response.json();
      navigate(`/ideas/${ideaData.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アイデアの投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-idea-page">
        <div className="create-idea-container">
          <div className="create-idea-header">
            <h1>新しいアイデアを投稿</h1>
            <p>あなたのアイデアを共有して、一緒に作ってくれる仲間を見つけましょう</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-idea-form">
            <div className="form-section">
              <h2>基本情報</h2>
              
              <div className="form-group">
                <label htmlFor="title">アイデアのタイトル *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="魅力的なタイトルを入力してください"
                  disabled={loading}
                  required
                />
                <span className="field-help">5文字以上で入力してください</span>
              </div>

              <div className="form-group">
                <label htmlFor="description">アイデアの説明 *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="あなたのアイデアについて詳しく説明してください。どんな問題を解決し、どのような価値を提供するのかを書いてください。"
                  disabled={loading}
                  rows={6}
                  required
                />
                <span className="field-help">20文字以上で入力してください</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">カテゴリ *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  >
                    <option value="">カテゴリを選択</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="duration">開発期間 *</label>
                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  >
                    <option value="">期間を選択</option>
                    {durations.map((duration, index) => (
                      <option key={index} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="teamSize">チームサイズ *</label>
                <input
                  type="number"
                  id="teamSize"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  disabled={loading}
                  required
                />
                <span className="field-help">あなたを含めた希望チーム人数（1〜10人）</span>
              </div>
            </div>

            <div className="form-section">
              <h2>技術スタック</h2>
              
              <div className="form-group">
                <label>使用予定の技術 *</label>
                <div className="tech-input-area">
                  <div className="tech-input-container">
                    <input
                      type="text"
                      className="tech-input"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={handleTechKeyPress}
                      placeholder="技術名を入力（例: React, Python, Firebase）"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="add-tech-btn"
                      onClick={addTechnology}
                      disabled={loading || !techInput.trim()}
                    >
                      追加
                    </button>
                  </div>
                  
                  {formData.technologies.length > 0 && (
                    <div className="technologies-list">
                      {formData.technologies.map((tech, index) => (
                        <span key={index} className="tech-tag">
                          {tech}
                          <button
                            type="button"
                            className="tech-remove"
                            onClick={() => removeTechnology(tech)}
                            disabled={loading}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="field-help">少なくとも1つの技術を追加してください</span>
              </div>
            </div>

            <div className="form-section">
              <h2>募集要項</h2>
              
              <div className="form-group">
                <label htmlFor="requirements">求めるスキル・経験</label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="どのようなスキルや経験を持つメンバーを求めているか記載してください。初心者歓迎、特定技術の経験者など。"
                  disabled={loading}
                  rows={4}
                />
                <span className="field-help">任意項目です</span>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/top')}
                className="btn btn-outline"
                disabled={loading}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner small"></span>
                    投稿中...
                  </>
                ) : (
                  'アイデアを投稿'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateIdeaPage;
