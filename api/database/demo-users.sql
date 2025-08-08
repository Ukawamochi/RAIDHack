-- デモユーザー（READMEで推奨されているアカウント + 既存のデモアカウント）
INSERT INTO users (email, username, password_hash, bio, skills) VALUES
('raid@example.com', 'raid_user', 'cGFzc3dvcmQ=', 'RAIDHackデモアカウント - README推奨', '["React", "TypeScript", "Node.js"]'),
('alice@example.com', 'alice_dev', 'ZGVtbzEyMw==', 'フロントエンド開発者', '["React", "TypeScript", "CSS"]'),
('bob@example.com', 'bob_backend', 'ZGVtbzEyMw==', 'バックエンド開発者', '["Node.js", "Python", "PostgreSQL"]');
