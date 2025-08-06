import { useState } from 'react'

function ApiTester() {
  const [result, setResult] = useState('ここに結果が表示されます')
  const [isLoading, setIsLoading] = useState(false)

  const testApi = async () => {
    setIsLoading(true)
    setResult('APIに接続中...')

    const isLocal = window.location.hostname === 'localhost'
    const endpoint = isLocal 
      ? 'http://localhost:8787/message'
      : 'https://api.ukawamochi5.workers.dev/message'

    try {
      const response = await fetch(endpoint)
      const text = await response.text()
      setResult(`✅ 成功: ${text}`)
    } catch (error) {
      setResult(`❌ エラー: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
          transition: 'all 0.2s',
          transform: 'scale(1)'
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = '#555'
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = '#666'
          }
        }}
        onMouseDown={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = '#444'
            e.currentTarget.style.transform = 'scale(0.98)'
          }
        }}
        onMouseUp={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = '#555'
            e.currentTarget.style.transform = 'scale(1)'
          }
        }}
      >
        {isLoading ? 'テスト中...' : 'APIをテスト'}
      </button>
      
      <div style={{
        marginTop: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        minHeight: '50px'
      }}>
        {result}
      </div>
    </div>
  )
}

export default ApiTester