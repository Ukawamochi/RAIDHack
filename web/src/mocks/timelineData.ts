import { IdeaDetail, IdeaDetailStatusEnum } from '../generated'

export const mockUsers = [
  {
    id: 1,
    username: 'alice_dev',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 2,
    username: 'bob_designer', 
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 3,
    username: 'charlie_pm',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 4,
    username: 'diana_fullstack',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 5,
    username: 'eve_data',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
  }
]

export const mockTimelinePosts: IdeaDetail[] = [
  {
    id: 1,
    title: 'AIを使った健康管理アプリ',
    description: '日々の食事や運動データからAIが健康アドバイスを提供するアプリを開発したいです！栄養士の監修も予定しています。',
    status: IdeaDetailStatusEnum.Open,
    user_id: 1,
    user: mockUsers[0],
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2時間前
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    required_skills: ['AI', 'HealthTech', 'React Native', 'Python'],
    applications: [
      { id: 1, idea_id: 1, applicant_id: 2, status: 'approved', message: 'UI/UXデザインで参加したいです！', applied_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString() },
      { id: 2, idea_id: 1, applicant_id: 3, status: 'pending', message: 'プロジェクト管理で貢献します', applied_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
      { id: 3, idea_id: 1, applicant_id: 4, status: 'approved', message: 'バックエンド開発担当希望', applied_at: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString() }
    ],
    like_count: 12
  },
  {
    id: 2,
    title: 'リアルタイム共同編集ツール',
    description: 'Notion的なドキュメント編集にリアルタイム協調機能を追加。WebSocketとOperational Transformを使用予定。',
    status: IdeaDetailStatusEnum.Open,
    user_id: 2,
    user: mockUsers[1],
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5時間前
    updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    required_skills: ['WebSocket', 'React', 'Node.js', 'Collaboration'],
    applications: [
      { id: 4, idea_id: 2, applicant_id: 5, status: 'approved', message: 'フロントエンド開発で参加したいです', applied_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() }
    ],
    like_count: 8
  },
  {
    id: 3,
    title: 'ブロックチェーン投票システム',
    description: '透明性の高い投票システムをブロックチェーンで実装。スマートコントラクトとWeb3.jsを使用します。',
    status: IdeaDetailStatusEnum.Development, // 募集終了
    user_id: 3,
    user: mockUsers[2],
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1日前
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    required_skills: ['Blockchain', 'Solidity', 'Web3.js', 'Ethereum'],
    applications: [
      { id: 5, idea_id: 3, applicant_id: 1, status: 'approved', message: 'Solidityでスマートコントラクト開発', applied_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() },
      { id: 6, idea_id: 3, applicant_id: 2, status: 'approved', message: 'フロントエンドUI作成', applied_at: new Date(Date.now() - 22.5 * 60 * 60 * 1000).toISOString() },
      { id: 7, idea_id: 3, applicant_id: 4, status: 'approved', message: 'セキュリティ監査担当', applied_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString() },
      { id: 8, idea_id: 3, applicant_id: 5, status: 'approved', message: 'テスト自動化', applied_at: new Date(Date.now() - 21.5 * 60 * 60 * 1000).toISOString() }
    ],
    like_count: 15
  },
  {
    id: 4,
    title: 'AR料理レシピアプリ',
    description: 'ARで料理手順を3Dで表示するアプリ。Unity + ARFoundationで開発予定。料理初心者でも分かりやすいUI設計を重視します。',
    status: IdeaDetailStatusEnum.Open,
    user_id: 4,
    user: mockUsers[3],
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12時間前
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    required_skills: ['AR', 'Unity', 'C#', 'Mobile'],
    applications: [
      { id: 9, idea_id: 4, applicant_id: 1, status: 'pending', message: 'ARエンジニアとして参加希望', applied_at: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString() },
      { id: 10, idea_id: 4, applicant_id: 5, status: 'approved', message: '3Dモデリング担当', applied_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() }
    ],
    like_count: 6
  },
  {
    id: 5,
    title: 'サステナブル消費トラッカー',
    description: '日常の購買行動の環境負荷を可視化するアプリ。バーコードスキャンで商品情報取得、CO2排出量計算機能付き。',
    status: IdeaDetailStatusEnum.Open,
    user_id: 5,
    user: mockUsers[4],
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3時間前
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    required_skills: ['Sustainability', 'React Native', 'API', 'Data Visualization'],
    applications: [],
    like_count: 4
  }
]

export const getCurrentUserApplications = (userId: number) => {
  return mockTimelinePosts.reduce((acc, post) => {
    const userApp = post.applications?.find(app => app.applicant_id === userId)
    if (userApp) {
      acc[post.id!] = userApp
    }
    return acc
  }, {} as Record<number, any>)
}

export const getCurrentUserLikes = (userId: number) => {
  // ランダムにいくつかの投稿にいいねをつけているとする
  const likedPosts = [1, 3, 5] // 投稿ID
  return likedPosts.reduce((acc, postId) => {
    acc[postId] = true
    return acc
  }, {} as Record<number, boolean>)
}