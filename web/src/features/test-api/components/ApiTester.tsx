import { useState } from 'react'
import type { ApiResponse } from '../../../types/api'

interface TestResult {
  success: boolean
  message: string
  data?: Record<string, unknown>
}

function ApiTester() {
  const [result, setResult] = useState<TestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testApi = async () => {
    setIsLoading(true)
    setResult({ success: false, message: 'APIに接続中...' })

    const apiBase = import.meta.env.VITE_API_BASE || 'https://api.ukawamochi5.workers.dev'
    const endpoint = `${apiBase}/message`

    try {
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: ApiResponse = await response.json()
      setResult({
        success: true,
        message: data.message,
        data: data.data
      })
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '50px auto',
      padding: '20px'
    }}>
      <h1>RAIDHack Hello World CI/CD working!</h1>
      
      <button 
        onClick={testApi}
        disabled={isLoading}
        style={{
          background: isLoading ? '#ccc' : '#666',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          borderRadius: '4px',
          transition: 'all 0.2s'
        }}
      >
        {isLoading ? 'テスト中...' : 'APIをテスト'}
      </button>
      
      <div style={{
        marginTop: '20px',
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        minHeight: '50px',
        backgroundColor: '#ffffff'
      }}>
        {!result ? (
          <span style={{ color: '#666' }}>ここに結果が表示されます</span>
        ) : (
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
          </>
        )}
      </div>
    </div>
  )
}

export default ApiTester
