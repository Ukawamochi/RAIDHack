-- ======================================
-- RAIDHack Platform Database Schema
-- Cloudflare D1 SQLite Database (Updated)
-- ======================================

-- Users テーブル
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  bio TEXT,
  skills TEXT, -- JSON形式でスキル配列を保存 ["React", "TypeScript"]
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ideas テーブル
CREATE TABLE ideas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT, -- JSON形式 ["React", "Node.js"]
  user_id INTEGER NOT NULL REFERENCES users(id),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'development', 'completed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Applications テーブル (修正版)
CREATE TABLE applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER NOT NULL REFERENCES ideas(id),
  applicant_id INTEGER NOT NULL REFERENCES users(id), -- user_id -> applicant_id
  message TEXT,
  motivation TEXT, -- 追加
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- created_at -> applied_at
  reviewed_at DATETIME, -- 追加
  review_message TEXT, -- 追加
  UNIQUE(idea_id, applicant_id) -- 同じアイデアに同じユーザーは1回のみ応募可能
);

-- Teams テーブル (修正版)
CREATE TABLE teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER UNIQUE NOT NULL REFERENCES ideas(id), -- 1つのアイデアに1つのチーム
  name TEXT NOT NULL, -- 追加
  description TEXT, -- 追加
  discord_invite_url TEXT, -- discord_url -> discord_invite_url
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'disbanded')), -- forming -> active
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP -- 追加
);

-- Team Members テーブル
CREATE TABLE team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL REFERENCES teams(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'member')),
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, user_id) -- 同じチームに同じユーザーは1回のみ参加可能
);

-- Works テーブル (修正版)
CREATE TABLE works (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL REFERENCES teams(id), -- idea_id -> team_id
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  demo_url TEXT, -- live_url -> demo_url
  repository_url TEXT, -- github_url -> repository_url
  technologies TEXT, -- JSON形式 ["React", "Node.js"]
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'published')), -- 追加
  submitted_at DATETIME, -- 追加
  published_at DATETIME, -- 追加
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vote テーブル (追加)
CREATE TABLE votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_id INTEGER NOT NULL REFERENCES works(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(work_id, user_id) -- 同じ作品に同じユーザーは1回のみ投票可能
);

-- Idea Likes テーブル
CREATE TABLE idea_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER NOT NULL REFERENCES ideas(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(idea_id, user_id) -- 同じアイデアに同じユーザーは1回のみいいね可能
);

-- Notifications テーブル
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('application', 'team_invite', 'application_status', 'new_idea', 'vote', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data TEXT, -- JSON形式で関連データを保存 {"ideaId": 1, "teamId": 2}
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- インデックス作成（パフォーマンス向上のため）
-- ==============================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Ideas
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created_at ON ideas(created_at);

-- Applications
CREATE INDEX idx_applications_idea_id ON applications(idea_id);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Teams
CREATE INDEX idx_teams_idea_id ON teams(idea_id);
CREATE INDEX idx_teams_status ON teams(status);

-- Team Members
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- Works
CREATE INDEX idx_works_team_id ON works(team_id);
CREATE INDEX idx_works_status ON works(status);

-- Votes
CREATE INDEX idx_votes_work_id ON votes(work_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);

-- Idea Likes
CREATE INDEX idx_idea_likes_idea_id ON idea_likes(idea_id);
CREATE INDEX idx_idea_likes_user_id ON idea_likes(user_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
