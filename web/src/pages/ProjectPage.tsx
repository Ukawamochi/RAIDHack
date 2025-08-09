import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ProjectPage: React.FC = () => {
    const { username, project: projectSlug } = useParams<{ username: string; project: string }>();

    // モックデータ（後でAPIから取得する）
    // slugベースでプロジェクトを特定
    const getProjectBySlug = (slug: string) => {
        const projects = {
            'ecommerce-site': {
                slug: 'ecommerce-site',
                title: 'E-commerce サイト',
                description: 'React + Next.jsで作った本格的なECサイトです。ユーザー認証、決済機能、商品管理機能を実装しています。',
                tags: ['React', 'Next.js', 'TypeScript', 'Stripe', 'MongoDB'],
                likes: 24,
                views: 156,
                createdAt: '2024-07-15',
                githubUrl: 'https://github.com/johndoe/ecommerce-site',
                demoUrl: 'https://demo-ecommerce.example.com',
                images: [
                    'https://via.placeholder.com/800x400/007bff/white?text=Screenshot+1',
                    'https://via.placeholder.com/800x400/28a745/white?text=Screenshot+2'
                ],
                features: [
                    'ユーザー認証・認可',
                    '商品検索・フィルタリング',
                    'ショッピングカート機能',
                    'Stripe決済連携',
                    '管理者ダッシュボード'
                ],
                techStack: [
                    { category: 'フロントエンド', technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
                    { category: 'バックエンド', technologies: ['Next.js API Routes', 'MongoDB', 'Prisma'] },
                    { category: 'その他', technologies: ['Stripe', 'Vercel', 'GitHub Actions'] }
                ]
            },
            'task-manager': {
                slug: 'task-manager',
                title: 'タスク管理アプリ',
                description: 'リアルタイム同期機能付きのタスク管理システムです。チーム協働とプロジェクト管理に最適化されています。',
                tags: ['React', 'Socket.io', 'MongoDB', 'Express'],
                likes: 18,
                views: 89,
                createdAt: '2024-06-20',
                githubUrl: 'https://github.com/johndoe/task-manager',
                demoUrl: 'https://demo-tasks.example.com',
                images: [
                    'https://via.placeholder.com/800x400/28a745/white?text=Task+Dashboard',
                    'https://via.placeholder.com/800x400/17a2b8/white?text=Team+View'
                ],
                features: [
                    'リアルタイム同期',
                    'チーム機能',
                    'プロジェクト管理',
                    'ガントチャート',
                    'ファイル添付'
                ],
                techStack: [
                    { category: 'フロントエンド', technologies: ['React', 'Socket.io Client', 'Chart.js'] },
                    { category: 'バックエンド', technologies: ['Node.js', 'Express', 'Socket.io', 'MongoDB'] },
                    { category: 'その他', technologies: ['JWT', 'Cloudinary', 'Heroku'] }
                ]
            }
        };
        return projects[slug as keyof typeof projects];
    };

    const project = getProjectBySlug(projectSlug || '');

    if (!project) {
        return (
            <div style={{
                padding: '40px',
                textAlign: 'center',
                backgroundColor: '#1a1a1a',
                minHeight: '100vh',
                color: '#ffffff'
            }}>
                <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#ffffff' }}>プロジェクトが見つかりません</h1>
                <p style={{ fontSize: '18px', color: '#cccccc' }}>指定されたプロジェクトは存在しないか、アクセス権限がありません。</p>
            </div>
        );
    }

    const author = {
        username: username,
        displayName: username === 'johndoe' ? 'John Doe' : username === 'janedoe' ? 'Jane Doe' : username
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
            {/* パンくずリスト */}
            <nav style={{ marginBottom: '30px', fontSize: '16px', color: '#cccccc' }}>
                <Link to={`/${username}`} style={{ color: '#00d4ff', textDecoration: 'none' }}>
                    @{username}
                </Link>
                <span style={{ margin: '0 15px' }}>/</span>
                <span>{project.title}</span>
            </nav>

            {/* プロジェクト情報 */}
            <div style={{ marginBottom: '50px' }}>
                <h1 style={{ margin: '0 0 20px 0', fontSize: '40px', fontWeight: 'bold' }}>{project.title}</h1>
                <p style={{ fontSize: '20px', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>{project.description}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginBottom: '25px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>作成者:</span>
                        <Link to={`/${username}`} style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
                            {author.displayName}
                        </Link>
                    </div>
                    <div style={{ fontSize: '16px' }}>❤️ {project.likes}</div>
                    <div style={{ fontSize: '16px' }}>👀 {project.views}</div>
                    <div style={{ fontSize: '16px' }}>📅 {project.createdAt}</div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                    {project.tags.map((tag, index) => (
                        <span
                            key={index}
                            style={{
                                backgroundColor: '#e9ecef',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '16px',
                                color: '#495057',
                                fontWeight: '500'
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                padding: '15px 25px',
                                backgroundColor: '#333',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}
                        >
                            GitHub
                        </a>
                    )}
                    {project.demoUrl && (
                        <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                padding: '15px 25px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}
                        >
                            デモを見る
                        </a>
                    )}
                    <button
                        style={{
                            padding: '15px 25px',
                            backgroundColor: 'transparent',
                            color: '#007bff',
                            border: '2px solid #007bff',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}
                    >
                        ❤️ いいね
                    </button>
                </div>
            </div>

            {/* スクリーンショット */}
            {project.images.length > 0 && (
                <div style={{ marginBottom: '50px' }}>
                    <h2 style={{ marginBottom: '25px', fontSize: '28px' }}>スクリーンショット</h2>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {project.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Screenshot ${index + 1}`}
                                style={{
                                    width: '100%',
                                    borderRadius: '12px',
                                    border: '2px solid #e9ecef'
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                {/* 機能一覧 */}
                <div>
                    <h2 style={{ marginBottom: '25px', fontSize: '28px' }}>主な機能</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {project.features.map((feature, index) => (
                            <li key={index} style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px' }}>
                                <span style={{ color: '#28a745', fontSize: '18px' }}>✓</span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 技術スタック */}
                <div>
                    <h2 style={{ marginBottom: '25px', fontSize: '28px' }}>技術スタック</h2>
                    {project.techStack.map((stack, index) => (
                        <div key={index} style={{ marginBottom: '25px' }}>
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#495057' }}>{stack.category}</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {stack.technologies.map((tech, techIndex) => (
                                    <span
                                        key={techIndex}
                                        style={{
                                            backgroundColor: '#f8f9fa',
                                            border: '1px solid #dee2e6',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            color: '#495057',
                                            fontWeight: '500'
                                        }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectPage;
