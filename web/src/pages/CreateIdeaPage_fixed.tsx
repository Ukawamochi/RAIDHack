import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateIdeaPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

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
  'その他'
];

const durations = [
  '1週間',
  '2週間',
  '1ヶ月',
  '2ヶ月',
  '3ヶ月',
  '長期'
];

const CreateIdeaPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [techInput, setTechInput] = useState('');

  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    technologies: [],
    category: '',
    teamSize: 2,
    duration: '',
    requirements: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'teamSize' ? parseInt(value) : value
    }));
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('認証が必要です');
      }

      const response = await fetch(`${API_BASE}/api/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          required_skills: formData.technologies
        })
      });

      if (!response.ok) {
        throw new Error('アイデアの投稿に失敗しました');
      }

      navigate('/ideas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-idea-page">
      <div className="create-idea-container">
        <div className="create-idea-header">
          <h1>新しいアイデアを投稿</h1>
          <p>あなたのアイデアを共有して、一緒に作ってくれる仲間を見つけましょう</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-idea-form">
          <div className="form-group">
            <label htmlFor="title">アイデアタイトル *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="革新的なWebアプリのアイデア"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">詳細説明 *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="アイデアの詳細、解決したい課題、想定するユーザーなどを詳しく説明してください"
              rows={6}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">カテゴリ *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">選択してください</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="duration">開発期間 *</label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
              >
                <option value="">選択してください</option>
                {durations.map(dur => (
                  <option key={dur} value={dur}>{dur}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="teamSize">希望チームサイズ *</label>
            <input
              type="number"
              id="teamSize"
              name="teamSize"
              value={formData.teamSize}
              onChange={handleInputChange}
              min="1"
              max="10"
              required
            />
            <small>自分を含む総人数（1〜10人）</small>
          </div>

          <div className="form-group">
            <label>必要な技術スタック *</label>
            <div className="tech-input-container">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="React, Node.js, Python など"
              />
              <button type="button" onClick={addTechnology}>追加</button>
            </div>
            <div className="tech-tags">
              {formData.technologies.map(tech => (
                <span key={tech} className="tech-tag">
                  {tech}
                  <button type="button" onClick={() => removeTechnology(tech)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="requirements">参加条件・その他要望</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              placeholder="特定のスキルレベル、コミット時間、コミュニケーション方法などの要望があれば記載してください"
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/ideas')} className="cancel-button">
              キャンセル
            </button>
            <button type="submit" disabled={loading} className="submit-button">
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
  );
};

export default CreateIdeaPage;
