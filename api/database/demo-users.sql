-- デモユーザーのみ（btoa()でハッシュ化されたパスワード）
INSERT INTO users (email, username, password_hash, bio, skills) VALUES
('demo@example.com', 'demo', 'ZGVtbzEyMw==', 'デモアカウント', '["React", "TypeScript"]'),
('alice@example.com', 'alice_dev', 'ZGVtbzEyMw==', 'フロントエンド開発者', '["React", "TypeScript", "CSS"]'),
('bob@example.com', 'bob_backend', 'ZGVtbzEyMw==', 'バックエンド開発者', '["Node.js", "Python", "PostgreSQL"]');
