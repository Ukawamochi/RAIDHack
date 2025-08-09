import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div
            style={{
                minHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '20px',
                backgroundColor: '#1a1a1a',
                color: '#ffffff'
            }}
        >
            <div style={{ fontSize: '120px', marginBottom: '20px' }}>🔍</div>
            <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', color: '#ffffff' }}>404</h1>
            <h2 style={{ fontSize: '24px', margin: '0 0 20px 0', color: '#cccccc' }}>
                ページが見つかりません
            </h2>
            <p style={{ fontSize: '16px', color: '#999999', marginBottom: '40px', maxWidth: '400px' }}>
                お探しのページは存在しないか、移動された可能性があります。
                URLをご確認いただくか、ホームページに戻ってください。
            </p>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link
                    to="/"
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        display: 'inline-block'
                    }}
                >
                    ホームに戻る
                </Link>
                <button
                    onClick={() => window.history.back()}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: 'transparent',
                        color: '#00d4ff',
                        border: '1px solid #00d4ff',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    前のページに戻る
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
