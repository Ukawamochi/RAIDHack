import React from 'react';

const LoginPage: React.FC = () => {
    return (
        <div style={{
            padding: '60px 20px',
            maxWidth: '500px',
            margin: '0 auto',
            minHeight: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a', // ダーク背景
            color: '#ffffff' // 白い文字
        }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '32px', color: '#ffffff' }}>ログイン</h1>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '500', color: '#ffffff' }}>
                        メールアドレス
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        style={{
                            width: '100%',
                            padding: '16px',
                            border: '2px solid #444444',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box',
                            backgroundColor: '#2a2a2a',
                            color: '#ffffff'
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '500', color: '#ffffff' }}>
                        パスワード
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        style={{
                            width: '100%',
                            padding: '16px',
                            border: '2px solid #444444',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box',
                            backgroundColor: '#2a2a2a',
                            color: '#ffffff'
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginTop: '10px'
                    }}
                >
                    ログイン
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
