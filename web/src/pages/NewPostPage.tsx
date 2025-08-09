import React, { useState } from 'react';

const NewPostPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');

    return (
        <div style={{
            padding: '40px 40px',
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            backgroundColor: '#1a1a1a',
            minHeight: '100vh',
            color: '#ffffff'
        }}>
            <h1 style={{ marginBottom: '40px', fontSize: '32px', color: '#ffffff' }}>新規投稿</h1>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div>
                    <label htmlFor="title" style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '18px', color: '#ffffff' }}>
                        プロジェクトタイトル
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="あなたのプロジェクトのタイトルを入力してください"
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
                    <label htmlFor="description" style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '18px', color: '#ffffff' }}>
                        プロジェクト説明
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="プロジェクトの詳細や技術スタック、目標などを説明してください"
                        rows={10}
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
                    <label htmlFor="tags" style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '18px', color: '#ffffff' }}>
                        タグ
                    </label>
                    <input
                        id="tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="React, TypeScript, Node.js など（カンマ区切り）"
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

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button
                        type="button"
                        style={{
                            padding: '16px 32px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}
                    >
                        下書き保存
                    </button>
                    <button
                        type="submit"
                        style={{
                            padding: '16px 32px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}
                    >
                        投稿する
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewPostPage;
