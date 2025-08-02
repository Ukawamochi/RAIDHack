document.addEventListener('DOMContentLoaded', function() {
    const testBtn = document.getElementById('testBtn');
    const apiResult = document.getElementById('apiResult');
    
    // API URL (本番環境では自動で切り替わります)
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:8787'  // ローカル開発時
        : 'https://api.raidhack.workers.dev';  // 本番環境
    
    testBtn.addEventListener('click', async function() {
        testBtn.disabled = true;
        testBtn.textContent = 'テスト中...';
        apiResult.className = 'result';
        apiResult.textContent = 'APIに接続しています...';
        
        try {
            // Workers APIの /message エンドポイントをテスト
            const response = await fetch(`${API_BASE_URL}/message`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.text();
            
            // 成功レスポンスを表示
            apiResult.className = 'result success';
            apiResult.textContent = `✅ 成功!\n\nAPI Response:\n${data}\n\nURL: ${API_BASE_URL}/message\nStatus: ${response.status} ${response.statusText}`;
            
        } catch (error) {
            // エラーレスポンスを表示
            apiResult.className = 'result error';
            apiResult.textContent = `❌ エラー\n\n${error.message}\n\nURL: ${API_BASE_URL}/message\n\nローカル開発の場合は、APIサーバーが起動しているか確認してください。`;
        } finally {
            testBtn.disabled = false;
            testBtn.textContent = 'APIをテスト';
        }
    });
    
    // ページ読み込み時に自動テスト
    testBtn.click();
});