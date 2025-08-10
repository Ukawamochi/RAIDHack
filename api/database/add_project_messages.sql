-- プロジェクトメッセージテーブルの追加

-- Project Messages テーブル（プロジェクト内チャット用）
CREATE TABLE IF NOT EXISTS project_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL, -- ideas.id を参照
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'public' CHECK (message_type IN ('public', 'private')),
  reply_to_id INTEGER, -- 返信先メッセージID（NULL可）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES ideas(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (reply_to_id) REFERENCES project_messages(id)
);

-- Project Message Recipients テーブル（プライベートメッセージの受信者管理）
CREATE TABLE IF NOT EXISTS project_message_recipients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_id INTEGER NOT NULL,
  recipient_id INTEGER NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at DATETIME,
  UNIQUE(message_id, recipient_id),
  FOREIGN KEY (message_id) REFERENCES project_messages(id),
  FOREIGN KEY (recipient_id) REFERENCES users(id)
);

-- プロジェクトの募集設定テーブル
CREATE TABLE IF NOT EXISTS project_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER UNIQUE NOT NULL,
  is_recruiting BOOLEAN DEFAULT TRUE,
  max_members INTEGER DEFAULT 10,
  github_url TEXT,
  demo_url TEXT,
  other_links TEXT, -- JSON形式で複数のリンクを保存
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES ideas(id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_project_messages_project_id ON project_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_project_messages_user_id ON project_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_project_messages_created_at ON project_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_project_messages_message_type ON project_messages(message_type);

CREATE INDEX IF NOT EXISTS idx_project_message_recipients_message_id ON project_message_recipients(message_id);
CREATE INDEX IF NOT EXISTS idx_project_message_recipients_recipient_id ON project_message_recipients(recipient_id);
CREATE INDEX IF NOT EXISTS idx_project_message_recipients_is_read ON project_message_recipients(is_read);

CREATE INDEX IF NOT EXISTS idx_project_settings_project_id ON project_settings(project_id);