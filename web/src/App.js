import React, { useState } from 'react';
import './App.css';

function App() {
  const [result, setResult] = useState('ここに結果が表示されます');
  const [isLoading, setIsLoading] = useState(false);

  const testAPI = async () => {
    setIsLoading(true);
    setResult('APIに接続中...');

    // 環境に応じたAPIエンドポイント
    const isLocal = window.location.hostname === 'localhost';
    const endpoint = isLocal 
      ? 'http://localhost:8787/message'
      : 'https://api.ukawamochi5.workers.dev/message';

    try {
      const response = await fetch(endpoint);
      const text = await response.text();
      setResult(`✅ 成功: ${text}`);
    } catch (error) {
      setResult(`❌ エラー: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>RAIDHack React App</h1>
      <button 
        onClick={testAPI} 
        disabled={isLoading}
        className="test-button"
      >
        {isLoading ? 'テスト中...' : 'APIをテスト'}
      </button>
      <div className="result">
        {result}
      </div>
    </div>
  );
}

export default App;
