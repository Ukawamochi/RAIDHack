-- サンプルユーザー（パスワードは 'password123' のハッシュ）
INSERT INTO users (email, username, password_hash, bio, skills) VALUES
('alice@example.com', 'alice_dev', '$2b$10$rQX.YQlZ4fEbgKX9zGJXBuVKj9xwJL2/8yNf5LpLdcfNRVtxFxu0e', 'フロントエンド開発者', '["React", "TypeScript", "CSS"]'),
('bob@example.com', 'bob_backend', '$2b$10$rQX.YQlZ4fEbgKX9zGJXBuVKj9xwJL2/8yNf5LpLdcfNRVtxFxu0e', 'バックエンド開発者', '["Node.js", "Python", "PostgreSQL"]'),
('charlie@example.com', 'charlie_mobile', '$2b$10$rQX.YQlZ4fEbgKX9zGJXBuVKj9xwJL2/8yNf5LpLdcfNRVtxFxu0e', 'モバイルアプリ開発者', '["React Native", "Swift", "Kotlin"]'),
('diana@example.com', 'diana_design', '$2b$10$rQX.YQlZ4fEbgKX9zGJXBuVKj9xwJL2/8yNf5LpLdcfNRVtxFxu0e', 'UI/UXデザイナー', '["Figma", "Adobe XD", "Sketch"]'),
('eva@example.com', 'eva_ai', '$2b$10$rQX.YQlZ4fEbgKX9zGJXBuVKj9xwJL2/8yNf5LpLdcfNRVtxFxu0e', 'AI/ML エンジニア', '["Python", "TensorFlow", "PyTorch"]');

-- サンプルアイデア
INSERT INTO ideas (title, description, required_skills, user_id, status) VALUES
('タスク管理アプリ', 'チーム向けの効率的なタスク管理ツール。リアルタイム同期とカンバンボード機能を持つ。', '["React", "Node.js", "Socket.io", "MongoDB"]', 1, 'open'),
('AIチャットボット', '自然言語処理を活用した顧客サポートチャットボット。企業向けのカスタマイズ可能なソリューション。', '["Python", "OpenAI", "FastAPI", "Redis"]', 2, 'open'),
('健康管理アプリ', '食事記録と運動ログを統合した健康管理アプリ。AIによる栄養アドバイス機能付き。', '["React Native", "Python", "TensorFlow", "SQLite"]', 3, 'development'),
('ECサイト構築ツール', 'ノーコードでECサイトを構築できるプラットフォーム。ドラッグ&ドロップでデザイン可能。', '["Vue.js", "Laravel", "MySQL", "Stripe"]', 1, 'open'),
('音楽共有SNS', '音楽好きのためのSNSプラットフォーム。プレイリスト共有とリアルタイム音楽セッション機能。', '["React", "Node.js", "WebRTC", "Spotify API"]', 1, 'completed');

-- サンプル応募
INSERT INTO applications (idea_id, applicant_id, message, status) VALUES
(1, 2, 'バックエンドAPIの開発を担当したいです。Node.jsとMongoDBの経験があります。', 'approved'),
(1, 3, 'モバイル版の開発も検討していますか？React Nativeでの実装経験があります。', 'pending'),
(1, 4, 'UI/UXデザインを担当させていただきたいです。', 'approved'),
(2, 1, 'フロントエンド側の実装を担当できます。React経験豊富です。', 'approved'),
(2, 5, 'AI部分の開発に興味があります。自然言語処理の研究経験があります。', 'approved'),
(3, 2, 'バックエンドAPIとデータベース設計を担当したいです。', 'pending'),
(4, 3, 'モバイルアプリ版も作りませんか？', 'rejected'),
(4, 5, 'AIを活用した商品推薦機能を追加しませんか？', 'pending');

-- サンプルチーム
INSERT INTO teams (idea_id, name, description, discord_invite_url, status) VALUES
(1, 'タスク管理アプリ チーム', 'タスク管理アプリの開発チーム', 'https://discord.gg/task-mgmt-team', 'active'),
(2, 'AIチャットボット チーム', 'AIチャットボットの開発チーム', 'https://discord.gg/ai-chatbot-team', 'active'),
(3, '健康管理アプリ チーム', '健康管理アプリの開発チーム', 'https://discord.gg/health-app-team', 'active'),
(5, '音楽共有SNS チーム', '音楽共有SNSの開発チーム', 'https://discord.gg/music-sns-team', 'completed');

-- サンプルチームメンバー
INSERT INTO team_members (team_id, user_id, role) VALUES
-- タスク管理アプリチーム
(1, 1, 'leader'),  -- alice (プロジェクト作成者)
(1, 2, 'member'),  -- bob (承認済み応募者)
(1, 4, 'member'),  -- diana (承認済み応募者)

-- AIチャットボットチーム
(2, 2, 'leader'),  -- bob (プロジェクト作成者)
(2, 1, 'member'),  -- alice (承認済み応募者)
(2, 5, 'member'),  -- eva (承認済み応募者)

-- 健康管理アプリチーム
(3, 3, 'leader'),  -- charlie (プロジェクト作成者)

-- 音楽共有SNSチーム（完成済み）
(4, 4, 'leader'),  -- diana (プロジェクト作成者)
(4, 1, 'member'),
(4, 2, 'member'),
(4, 3, 'member');

-- サンプル成果物
INSERT INTO works (team_id, title, description, demo_url, repository_url, status) VALUES
(4, 'MusicConnect', '音楽好きのためのソーシャルプラットフォーム。リアルタイムでプレイリストを共有し、友達と一緒に音楽を楽しめます。', 'https://musicconnect-demo.pages.dev', 'https://github.com/music-team/musicconnect', 'published');

-- サンプルいいね
INSERT INTO idea_likes (idea_id, user_id) VALUES
(1, 2), (1, 3), (1, 4), (1, 5),  -- タスク管理アプリ
(2, 1), (2, 3), (2, 4),          -- AIチャットボット
(3, 1), (3, 2), (3, 4), (3, 5),  -- 健康管理アプリ
(4, 2), (4, 3), (4, 5),          -- ECサイト構築ツール
(5, 1), (5, 2), (5, 3), (5, 5);  -- 音楽共有SNS

-- サンプル投票
INSERT INTO votes (work_id, user_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 5);  -- MusicConnect への投票
