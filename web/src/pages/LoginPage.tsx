import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './AuthPages.css'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        navigate('/top')
      } else {
        setError('メールアドレスまたはパスワードが正しくありません')
      }
    } catch {
      setError('ログイン中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>RAIDHackにログイン</h1>
          <p>アカウントにサインインして続行</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="パスワードを入力"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner small"></span>
                ログイン中...
              </>
            ) : (
              'ログイン'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>または</span>
        </div>

        <div className="auth-demo">
          <p className="demo-text">デモアカウントでお試し</p>
          <button 
            onClick={() => setFormData({ email: 'demo@example.com', password: 'demo123' })}
            className="btn btn-outline btn-full"
            type="button"
          >
            デモアカウントを使用
          </button>
        </div>

        <div className="auth-footer">
          <p>
            アカウントをお持ちでない方は
            <Link to="/register">新規登録</Link>
          </p>
          <p>
            <Link to="/">ホームに戻る</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
