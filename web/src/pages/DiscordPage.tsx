import React from 'react';
import { useParams } from 'react-router-dom';
import './DiscordPage.css';

const DiscordPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();

  if (teamId) {
    // チーム固有のDiscordページ
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
        <h2>Discord連携ページ</h2>
        <p>チームID: <b>{teamId}</b></p>
        <p>このページは将来的な拡張用のプレースホルダーです。<br />
          DiscordサーバーのURL共有やBot連携などの機能を追加できます。
        </p>
        <p style={{ color: '#888', marginTop: 32 }}>
          ※現状はチーム管理ページ（/teams）でDiscord URLの設定・共有が可能です。
        </p>
      </div>
    );
  }

  // 一般的なDiscordコミュニティページ
  return (
    <div className="discord-page">
      <div className="discord-container">
        <div className="discord-header">
          <h1>RAID Hack Discordサーバー</h1>
          <p>コミュニティメンバーと交流しましょう</p>
        </div>

        <div className="discord-content">
          <div className="discord-info">
            <h2>Discordサーバーに参加して</h2>
            <ul>
              <li>他の開発者と気軽にチャットできます</li>
              <li>プロジェクトの進捗報告や相談ができます</li>
              <li>技術的な質問や解決策を共有できます</li>
              <li>新しいアイデアやコラボレーションのきっかけが見つかります</li>
              <li>ハッカソンやイベントの最新情報をお届けします</li>
            </ul>
          </div>

          <div className="discord-join">
            <div className="discord-invite-card">
              <div className="discord-logo">
                <svg viewBox="0 0 24 24" width="60" height="60" fill="#5865F2">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <h3>RAID Hack Community</h3>
              <p>活発なコミュニティで新しいつながりを作りましょう</p>
              <a 
                href="https://discord.gg/raidhack" 
                target="_blank" 
                rel="noopener noreferrer"
                className="discord-join-button"
              >
                Discordサーバーに参加
              </a>
            </div>
          </div>
        </div>

        <div className="discord-features">
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>リアルタイムチャット</h3>
              <p>技術的な議論から雑談まで、様々なチャンネルで交流できます</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>チームマッチング</h3>
              <p>プロジェクトに参加したいメンバーや一緒に開発するパートナーを見つけられます</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📢</div>
              <h3>イベント情報</h3>
              <p>ハッカソンやワークショップなどのイベント情報をいち早くお届けします</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛠️</div>
              <h3>技術サポート</h3>
              <p>開発中の困りごとや技術的な質問に、コミュニティメンバーが答えてくれます</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordPage;
