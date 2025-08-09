-- =============================================
-- 不足しているテーブルの追加
-- =============================================

-- Votes テーブル (作品への投票)
CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_id INTEGER NOT NULL REFERENCES works(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(work_id, user_id) -- 同じ作品に同じユーザーは1回のみ投票可能
);

-- 投票テーブルのインデックス
CREATE INDEX IF NOT EXISTS idx_votes_work_id ON votes(work_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

-- 確認用: テーブルが正しく作成されたかチェック
-- SELECT name FROM sqlite_master WHERE type='table' AND name='votes';
