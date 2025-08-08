-- 新しいREADME推奨デモユーザーを追加（存在しない場合のみ）
INSERT OR IGNORE INTO users (email, username, password_hash, bio, skills) VALUES
('raid@example.com', 'raid_user', 'cGFzc3dvcmQ=', 'RAIDHackデモアカウント - README推奨', '["React", "TypeScript", "Node.js"]');

-- 既存ユーザーの情報を確認
SELECT email, username, bio FROM users WHERE email IN ('raid@example.com', 'demo@example.com');
