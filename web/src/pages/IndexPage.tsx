import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const IndexPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // モックデータ（後でAPIから取得）
  const featuredProjects = [
    {
      id: 1,
      title: 'E-commerce サイト',
      slug: 'ecommerce-site',
      description: 'React + Next.jsで作った本格的なECサイト',
      author: 'johndoe',
      authorName: 'John Doe',
      tags: ['React', 'Next.js', 'TypeScript'],
      likes: 24,
      image: 'https://via.placeholder.com/400x200/007bff/white?text=E-commerce'
    },
    {
      id: 2,
      title: 'タスク管理アプリ',
      slug: 'task-manager',
      description: 'リアルタイム同期機能付きのタスク管理システム',
      author: 'janedoe',
      authorName: 'Jane Doe',
      tags: ['React', 'Socket.io', 'MongoDB'],
      likes: 18,
      image: 'https://via.placeholder.com/400x200/28a745/white?text=Task+Manager'
    },
    {
      id: 3,
      title: 'ブログプラットフォーム',
      slug: 'blog-platform',
      description: 'Markdown対応のブログ投稿プラットフォーム',
      author: 'bobsmith',
      authorName: 'Bob Smith',
      tags: ['Vue.js', 'Express', 'PostgreSQL'],
      likes: 32,
      image: 'https://via.placeholder.com/400x200/dc3545/white?text=Blog+Platform'
    }
  ];

  return (
    <div style={{
      padding: '40px 40px',
      width: '100%',
      margin: '0',
      backgroundColor: '#1a1a1a', // ダークグレー背景
      minHeight: '100vh',
      color: '#ffffff' // 白い文字
    }}>
      {/* ヒーローセクション */}
      <section style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={{
          fontSize: '60px',
          fontWeight: 'bold',
          marginBottom: '25px',
          color: '#00d4ff', // 明るい青色でフォールバック
          background: 'linear-gradient(135deg, #00d4ff 0%, #00ff88 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          RAIDHack!
        </h1>
        <p style={{
          fontSize: '24px',
          color: '#cccccc', // 明るいグレー
          marginBottom: '40px',
          lineHeight: '1.6',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          アイデアを投稿し、メンバーを募ってレイドでハッカソンを行うハッカソンSNS
        </p>

        {!isAuthenticated && (
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link
              to="/login"
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '18px 35px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '20px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)'
              }}
            >
              始める
            </Link>
            <a
              href="#features"
              style={{
                backgroundColor: 'transparent',
                color: '#00d4ff', // 明るい青
                padding: '18px 35px',
                border: '2px solid #00d4ff',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '20px',
                fontWeight: '600'
              }}
            >
              詳しく見る
            </a>
          </div>
        )}
      </section>

      {/* 特徴セクション */}
      <section id="features" style={{ marginBottom: '80px' }}>
        <h2 style={{
          fontSize: '40px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '60px',
          color: '#ffffff' // 白い文字
        }}>
          RAIDHack!の特徴
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '40px',
          marginBottom: '60px'
        }}>
          <div style={{
            backgroundColor: '#2a2a2a', // ダークグレーカード
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>💡</div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', color: '#ffffff' }}>
              アイデア投稿
            </h3>
            <p style={{ fontSize: '18px', color: '#cccccc', lineHeight: '1.6' }}>
              ハッカソンアイデアを投稿して、同じ志を持つメンバーを募集しましょう
            </p>
          </div>

          <div style={{
            backgroundColor: '#2a2a2a', // ダークグレーカード
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>👥</div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', color: '#ffffff' }}>
              チーム結成
            </h3>
            <p style={{ fontSize: '18px', color: '#cccccc', lineHeight: '1.6' }}>
              スキルや興味に応じて最適なチームメンバーと出会えます
            </p>
          </div>

          <div style={{
            backgroundColor: '#2a2a2a', // ダークグレーカード
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>🚀</div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', color: '#ffffff' }}>
              レイド開発
            </h3>
            <p style={{ fontSize: '18px', color: '#cccccc', lineHeight: '1.6' }}>
              オンラインでハッカソンを実行し、成果物を公開・評価しあえます
            </p>
          </div>
        </div>
      </section>

      {/* 特集プロジェクト */}
      <section>
        <h2 style={{
          fontSize: '40px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '60px',
          color: '#ffffff' // 白い文字
        }}>
          特集プロジェクト
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '30px'
        }}>
          {featuredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/${project.author}/${project.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  backgroundColor: '#2a2a2a', // ダークカード背景
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ padding: '25px' }}>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    color: '#ffffff' // 白い文字
                  }}>
                    {project.title}
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: '#cccccc', // 明るいグレー
                    marginBottom: '15px',
                    lineHeight: '1.5'
                  }}>
                    {project.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <span style={{ fontSize: '16px', color: '#cccccc' }}>
                      by {project.authorName}
                    </span>
                    <span style={{ fontSize: '16px', color: '#ff6b6b' }}>
                      ❤️ {project.likes}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: '#3a3a3a', // ダークタグ背景
                          color: '#ffffff', // 白い文字
                          padding: '6px 12px',
                          borderRadius: '16px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* コールトゥアクション */}
      {!isAuthenticated && (
        <section style={{
          textAlign: 'center',
          marginTop: '100px',
          padding: '60px 40px',
          backgroundColor: '#2a2a2a', // ダーク背景
          borderRadius: '20px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#ffffff' // 白い文字
          }}>
            今すぐRAIDHack!を始めよう
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#cccccc', // 明るいグレー
            marginBottom: '30px'
          }}>
            あなたのアイデアが世界を変えるかもしれません
          </p>
          <Link
            to="/login"
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '18px 40px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '20px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
            }}
          >
            無料で始める
          </Link>
        </section>
      )}
    </div>
  );
};

export default IndexPage;
