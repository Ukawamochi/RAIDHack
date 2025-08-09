import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        bio: '',
        publicProfile: true
    });

    return (
        <div style={{
            padding: '40px 40px',
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto',
            backgroundColor: '#1a1a1a',
            minHeight: '100vh',
            color: '#ffffff'
        }}>
            <h1 style={{ marginBottom: '40px', fontSize: '32px', color: '#ffffff' }}>設定</h1>            <div style={{ marginBottom: '60px' }}>
                <h2 style={{ borderBottom: '2px solid #444444', paddingBottom: '15px', fontSize: '24px', marginBottom: '30px', color: '#ffffff' }}>プロフィール設定</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div>
                        <label htmlFor="username" style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '16px', color: '#ffffff' }}>
                            ユーザー名
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={profile.username}
                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
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
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '16px', color: '#ffffff' }}>
                            メールアドレス
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
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
                        <label htmlFor="bio" style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '16px', color: '#ffffff' }}>
                            自己紹介
                        </label>
                        <textarea
                            id="bio"
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            rows={6}
                            style={{
                                width: '100%',
                                padding: '16px',
                                border: '2px solid #444444',
                                borderRadius: '8px',
                                fontSize: '16px',
                                resize: 'vertical',
                                boxSizing: 'border-box',
                                backgroundColor: '#2a2a2a',
                                color: '#ffffff'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#ffffff' }}>
                            <input
                                type="checkbox"
                                checked={profile.publicProfile}
                                onChange={(e) => setProfile({ ...profile, publicProfile: e.target.checked })}
                                style={{ width: '20px', height: '20px' }}
                            />
                            プロフィールを公開する
                        </label>
                    </div>
                </form>
            </div>

            <div style={{ marginBottom: '60px' }}>
                <h2 style={{ borderBottom: '2px solid #444444', paddingBottom: '15px', fontSize: '24px', marginBottom: '30px', color: '#ffffff' }}>通知設定</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#ffffff' }}>
                        <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                        新しいフォロワーの通知
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#ffffff' }}>
                        <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                        プロジェクトへのコメント通知
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#ffffff' }}>
                        <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                        メール通知
                    </label>
                </div>
            </div>

            <button
                style={{
                    padding: '16px 32px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                }}
            >
                設定を保存
            </button>
        </div>
    );
};

export default SettingsPage;
