import { useState } from 'react'

function ApiTester() {
  const [result, setResult] = useState('ここに結果が表示されます')
  const [isLoading, setIsLoading] = useState(false)

  const testApi = async () => {
    setIsLoading(true)
    setResult('APIに接続中...')

    const apiBase = import.meta.env.VITE_API_BASE || 'https://raidhack-api.ukawamochi5.workers.dev'
    const endpoint = `${apiBase}/message`

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
          transition: 'all 0.2s'
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