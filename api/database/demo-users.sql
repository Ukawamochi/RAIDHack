-- デモユーザーのみ
INSERT INTO users (email, username, password_hash, bio, skills) VALUES
('demo@example.com', 'demo', '$2b$10$rQX.YQlZ4fEbgKX9zGJXBuVKj9xwJL2/8yNf5LpLdcfNRVtxFxu0e', 'デモアカウント', '["React", "TypeScript"]'),
('alice@example.com', 'alice_dev', '$2b$10$rQX.YQlZ4fEbgKX9zGJXBuVKj9xwJL2/8yNf5LpLdcfNRVtxFxu0e', 'フロントエンド開発者', '["React", "TypeScript", "CSS"]'),
('bob@example.com', 'bob_backend', '$2b$10$rQX.YQlZ4fEbgKX9zGJXBuVKj9xwJL2/8yNf5LpLdcfNRVtxFxu0e', 'バックエンド開発者', '["Node.js", "Python", "PostgreSQL"]');
