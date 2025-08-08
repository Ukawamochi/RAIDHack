import React from 'react';
import { useParams } from 'react-router-dom';

const DiscordPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();

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
};

export default DiscordPage;
