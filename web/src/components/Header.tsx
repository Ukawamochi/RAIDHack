import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
    const { isAuthenticated, user, logout, devLogin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDevLogin = () => {
        devLogin();
        navigate('/');
    };

    return (
        <header
            style={{
                backgroundColor: '#2a2a2a', // ダークヘッダー背景
                borderBottom: '2px solid #444444',
                padding: '15px 0',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                width: '100%'
            }}
        >
            <div
                style={{
                    maxWidth: '100%',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 40px'
                }}
            >
                {/* ロゴ・ブランド */}
                <Link
                    to="/"
                    style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        color: '#00d4ff' // ブライトブルー
                    }}
                >
                    RAIDHack!
                </Link>

                {/* ナビゲーション */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <Link
                        to="/"
                        style={{ textDecoration: 'none', color: '#ffffff', fontSize: '18px', fontWeight: '500' }}
                    >
                        ホーム
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/new"
                                style={{
                                    textDecoration: 'none',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    padding: '12px 20px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }}
                            >
                                新規投稿
                            </Link>

                            <div style={{ position: 'relative' }}>
                                <Link
                                    to={`/${user?.username}`}
                                    style={{
                                        textDecoration: 'none',
                                        color: '#ffffff', // 白い文字
                                        fontSize: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        fontWeight: '500'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: '#3a3a3a', // ダークアイコン背景
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '16px',
                                            color: '#ffffff', // 白い文字
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {user?.displayName?.charAt(0) || user?.username?.charAt(0)}
                                    </div>
                                    {user?.username}
                                </Link>
                            </div>

                            <Link
                                to="/settings"
                                style={{ textDecoration: 'none', color: '#cccccc', fontSize: '18px', fontWeight: '500' }}
                            >
                                設定
                            </Link>

                            <button
                                onClick={handleLogout}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: '2px solid #dc3545',
                                    color: '#dc3545',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '500'
                                }}
                            >
                                ログアウト
                            </button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <button
                                onClick={handleDevLogin}
                                style={{
                                    textDecoration: 'none',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    padding: '12px 20px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                🚀 開発用ログイン
                            </button>
                            <Link
                                to="/login"
                                style={{
                                    textDecoration: 'none',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    padding: '12px 20px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }}
                            >
                                ログイン
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
