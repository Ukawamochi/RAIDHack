import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './HomePage.css'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            ハッカソンで<br />
            アイデアを現実に
          </h1>
          <p className="hero-subtitle">
            RAIDHackは、シンプルで使いやすいハッカソンプラットフォームです。<br />
            アイデアの投稿からチーム形成、開発、成果物の共有まで一気通貫でサポートします。
          </p>
          
          <div className="hero-actions">
            {user ? (
              <Link to="/top" className="btn btn-primary btn-large">
                ダッシュボードへ
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-large">
                  今すぐ始める
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  ログイン
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">RAIDHackの特徴</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>アイデアを投稿</h3>
              <p>
                あなたの革新的なアイデアを投稿し、同じ志を持つ開発者とつながりましょう。
                技術スタックや必要なスキルを明記して、最適なチームメンバーを見つけられます。
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>チーム形成</h3>
              <p>
                興味のあるプロジェクトに応募し、スキルマッチングによって最強のチームを結成。
                Discord連携でスムーズなコミュニケーションが可能です。
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>開発・公開</h3>
              <p>
                チームで協力してプロダクトを開発し、完成した成果物を公開。
                他の参加者からの投票やフィードバックを受けて、さらなる改善に活かせます。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">アクティブユーザー</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">投稿されたアイデア</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">25+</div>
              <div className="stat-label">完成したプロジェクト</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">チーム参加数</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>今すぐ参加して、次世代のプロダクトを作ろう</h2>
            <p>
              RAIDHackで新しい出会いと学びを体験し、あなたのアイデアを形にしませんか？
            </p>
            {!user && (
              <Link to="/register" className="btn btn-primary btn-large">
                無料で始める
              </Link>
            )}
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">RAIDHack</div>
            <div className="footer-links">
              <a href="#about">サービスについて</a>
              <a href="#privacy">プライバシーポリシー</a>
              <a href="#terms">利用規約</a>
              <a href="#contact">お問い合わせ</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 RAIDHack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
