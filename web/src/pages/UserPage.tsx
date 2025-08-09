import React from 'react';
import { useParams, Link } from 'react-router-dom';

const UserPage: React.FC = () => {
    const { username } = useParams<{ username: string }>();

    // モックデータ（後でAPIから取得する）
    const user = {
        username: username,
        displayName: 'John Doe',
        bio: 'フルスタックエンジニア。React、Node.js、TypeScriptが得意です。',
        followers: 128,
        following: 85,
        projects: [
            {
                id: 1,
                title: 'E-commerce サイト',
                slug: 'ecommerce-site', // GitHub風のプロジェクト名
                description: 'React + Next.jsで作ったECサイト',
                tags: ['React', 'Next.js', 'TypeScript'],
                likes: 24
            },
            {
                id: 2,
                title: 'タスク管理アプリ',
                slug: 'task-manager', // GitHub風のプロジェクト名
                description: 'リアルタイム同期機能付きのタスク管理',
                tags: ['React', 'Socket.io', 'MongoDB'],
                likes: 18
            }
        ]
    };

    return (
        <div style={{
            padding: '40px 40px',
            width: '100%',
            maxWidth: '1500px',
            margin: '0 auto',
            backgroundColor: '#1a1a1a',
            minHeight: '100vh',
            color: '#ffffff'
        }}>
            {/* ユーザープロフィール */}
            <div style={{ marginBottom: '60px', textAlign: 'center' }}>
                <div
                    style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        backgroundColor: '#2a2a2a', // ダークグレー
                        margin: '0 auto 30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '60px',
                        color: '#ffffff' // 白い文字
                    }}
                >
                    {user.displayName.charAt(0)}
                </div>
                <h1 style={{ margin: '0 0 15px 0', fontSize: '36px', color: '#ffffff' }}>{user.displayName}</h1>
                <p style={{ color: '#cccccc', margin: '0 0 15px 0', fontSize: '18px' }}>@{user.username}</p>
                <p style={{ margin: '0 auto 30px auto', maxWidth: '600px', fontSize: '16px', lineHeight: '1.6', color: '#cccccc' }}>{user.bio}</p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginBottom: '30px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff' }}>{user.followers}</div>
                        <span style={{ fontSize: '16px', color: '#cccccc' }}>フォロワー</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff' }}>{user.following}</div>
                        <span style={{ fontSize: '16px', color: '#cccccc' }}>フォロー中</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff' }}>{user.projects.length}</div>
                        <span style={{ fontSize: '16px', color: '#cccccc' }}>プロジェクト</span>
                    </div>
                </div>

                <button
                    style={{
                        padding: '15px 30px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600'
                    }}
                >
                    フォローする
                </button>
            </div>

            {/* プロジェクト一覧 */}
            <div>
                <h2 style={{ borderBottom: '2px solid #444444', paddingBottom: '15px', marginBottom: '30px', fontSize: '28px', color: '#ffffff' }}>
                    プロジェクト
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                    {user.projects.map((project) => (
                        <Link
                            key={project.id}
                            to={`/${username}/${project.slug}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div
                                style={{
                                    border: '2px solid #444444', // ダークボーダー
                                    borderRadius: '12px',
                                    padding: '25px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: '#2a2a2a' // ダーク背景
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.5)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <h3 style={{ margin: '0 0 15px 0', fontSize: '22px', color: '#ffffff' }}>{project.title}</h3>
                                <p style={{ margin: '0 0 20px 0', color: '#cccccc', lineHeight: '1.6', fontSize: '16px' }}>{project.description}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                                    {project.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                backgroundColor: '#3a3a3a', // ダークタグ背景
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                color: '#ffffff', // 白いテキスト
                                                fontWeight: '500'
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div style={{ color: '#ff6b6b', fontSize: '16px', fontWeight: '500' }}>❤️ {project.likes}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserPage;
