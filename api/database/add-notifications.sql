-- 通知テーブルの追加
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('application', 'team_invite', 'application_status', 'new_idea', 'vote', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data TEXT, -- JSON形式で関連データを保存 {"ideaId": 1, "teamId": 2}
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 通知テーブルのインデックス
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
