import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
    const { isLoggedIn, login, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogin = () => {
        login()
        // ログイン後はホームページにリダイレクト
        navigate('/')
    }

    const handleLogout = () => {
        logout()
    }

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
                backgroundColor: '#f9f9f9'
            }}>
                {!isLoggedIn ? (
                    <>
                        <p style={{ marginBottom: '20px', color: 'black' }}>仮ログイン機能</p>
                        <button
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                            onClick={handleLogin}
                        >
                            ログイン
                        </button>
                        <p style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
                            ※ これは開発用の仮ログイン機能です
                        </p>
                    </>
                ) : (
                    <>
                        <p style={{ marginBottom: '20px' }}>✅ ログイン済み</p>
                        <button
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                            onClick={handleLogout}
                        >
                            ログアウト
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default LoginPage
