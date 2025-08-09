import { Link } from 'react-router-dom'

function NotFoundPage() {
    return (
        <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            maxWidth: '500px',
            margin: '0 auto',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <div style={{ fontSize: '72px', marginBottom: '20px' }}>
                🤖
            </div>

            <h1 style={{ fontSize: '48px', color: '#666', marginBottom: '20px' }}>
                404
            </h1>

            <h2 style={{ color: '#333', marginBottom: '20px' }}>
                ページが見つかりません
            </h2>

            <p style={{ color: '#666', marginBottom: '40px', fontSize: '16px' }}>
                お探しのページは存在しないか、移動された可能性があります。<br />
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                    to="/"
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}
                >
                    🏠 ホームに戻る
                </Link>
            </div>
        </div>
    )
}

export default NotFoundPage
