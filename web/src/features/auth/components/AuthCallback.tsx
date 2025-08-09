import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authApi } from '../../../lib/api'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { setAuthData } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.size === 0) {
          return
        }
        const code = urlParams.get('code')
        const state = urlParams.get('state')
        const error = urlParams.get('error')

        if (error) {
          throw new Error(`OAuth error: ${error}`)
        }

        if (!code) {
          throw new Error('No authorization code received')
        }

        // Verify state parameter
        const storedState = sessionStorage.getItem('oauth_state')
        if (!storedState || storedState !== state) {
          throw new Error('Invalid state parameter')
        }

        // Clear the URL to prevent code reuse
        window.history.replaceState({}, document.title, window.location.pathname)
        const authResponse = await authApi.apiAuthGithubCallbackPost({
          code: code
        })

        if (!authResponse.data.success) {
          throw new Error(`Authentication error: ${authResponse.data.message}`)
        }

        if (!authResponse.data.user || !authResponse.data.token) {
          throw new Error('Invalid authentication response: missing user or token')
        }

        // Store user data and JWT token using AuthContext
        setAuthData(authResponse.data.user, authResponse.data.token)
        
        // Clean up session storage
        sessionStorage.removeItem('oauth_state')

        setStatus('success')
        
        navigate('/', { replace: true })

      } catch (err) {
        console.error('OAuth callback error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        setStatus('error')
        
        // Clean up session storage
        sessionStorage.removeItem('oauth_state')
      }
    }

    handleCallback()
  }, [navigate, setAuthData])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      {status === 'loading' && (
        <div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          <h2>Authenticating with GitHub...</h2>
          <p>Please wait while we complete the authentication process.</p>
        </div>
      )}
      
      {status === 'success' && (
        <div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>✅</div>
          <h2>Authentication Successful!</h2>
          <p style={{ marginBottom: '20px' }}>ログインが完了しました。</p>
          <button
            onClick={() => {
              navigate('/', { replace: true })
              window.location.reload()
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            ホームページに戻る
          </button>
        </div>
      )}
      
      {status === 'error' && (
        <div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>❌</div>
          <h2>Authentication Failed</h2>
          <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
          <button
            onClick={() => navigate('/', { replace: true })}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            ホームページに戻る
          </button>
        </div>
      )}
    </div>
  )
}