import { useState } from 'react'
import { useAuth } from '../../auth'
import { systemApi } from '../../../lib/api'

interface TestResult {
  success: boolean
  message: string
  data?: Record<string, unknown>
}

type LoadingStatus = 'idle' | 'loading' | 'success' | 'error'

function ApiTester() {
  const [status, setStatus] = useState<LoadingStatus>('idle')
  const [result, setResult] = useState<TestResult | null>(null)
  const { isAuthenticated, user } = useAuth()

  const testHealthCheck = async () => {
    setStatus('loading')
    setResult(null)

    try {
      const response = await systemApi.healthGet()
      setResult({
        success: true,
        message: `サーバーステータス: ${response.data.status}`,
        data: {
          service: response.data.service,
          timestamp: response.data.timestamp
        }
      })
      setStatus('success')
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
      setStatus('error')
    }
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '50px auto',
      padding: '20px'
    }}>
      <h1>RAIDHack API テスター</h1>
      
      {isAuthenticated && user && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#e8f5e8', 
          borderRadius: '4px' 
        }}>
          <strong>認証済み:</strong> {user.username} ({user.email})
        </div>
      )}
      
      <button 
        onClick={testHealthCheck}
        disabled={status === 'loading'}
        style={{
          background: status === 'loading' ? '#ccc' : '#666',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          borderRadius: '4px',
          transition: 'all 0.2s',
          marginRight: '10px'
        }}
      >
        {status === 'loading' ? 'テスト中...' : 'ヘルスチェック'}
      </button>
      
      <div style={{
        marginTop: '20px',
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        minHeight: '50px',
        backgroundColor: '#ffffff'
      }}>
        {status === 'idle' && (
          <span style={{ color: '#666' }}>ボタンをクリックしてAPIをテストしてください</span>
        )}
        
        {status === 'loading' && (
          <div style={{ color: '#666' }}>
            <span>🔄 API接続中...</span>
          </div>
        )}
        
        {(status === 'success' || status === 'error') && result && (
          <>
            <div style={{ 
              color: result.success ? '#28a745' : '#dc3545',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              {result.success ? '✅ 成功' : '❌ エラー'}
            </div>
            <div style={{ 
              marginBottom: '8px',
              color: '#333333'
            }}>
              {result.message}
            </div>
            {result.data && (
              <div style={{ 
                fontSize: '12px',
                color: '#666',
                backgroundColor: '#f8f9fa',
                padding: '8px',
                borderRadius: '4px',
                marginTop: '8px'
              }}>
                <pre>{JSON.stringify(result.data, null, 2)}</pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ApiTester
