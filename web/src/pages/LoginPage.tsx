function LoginPage() {
    return (
        <div style={{ padding: '20px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
            <h1>ログイン</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
                RAIDHack!にログインしてハッカソンを始めよう！
            </p>

            <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '30px',
                backgroundColor: '#3c3838ff'
            }}>
                <p style={{ marginBottom: '20px' }}>🚧 ログイン機能は開発中です</p>
                <button
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                    onClick={() => alert('ログイン機能を準備中です！')}
                >
                    ログイン（準備中）
                </button>
            </div>
        </div>
    )
}

export default LoginPage
