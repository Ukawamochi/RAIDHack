-- ======================================
-- RAIDHack Platform Database Schema
-- Cloudflare D1 SQLite Database (Updated)
-- ======================================

-- Users テーブル
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS ideas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT, -- JSON形式 ["React", "Node.js"]
  user_id INTEGER NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'development', 'completed')),
  start_date DATETIME, -- レイド開始日
  deadline DATETIME, -- 期限
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100), -- 進捗率(0-100)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Applications テーブル (修正版)
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER NOT NULL,
  applicant_id INTEGER NOT NULL,
  message TEXT,
  motivation TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME,
  review_message TEXT,
  UNIQUE(idea_id, applicant_id),
  FOREIGN KEY (idea_id) REFERENCES ideas(id),
  FOREIGN KEY (applicant_id) REFERENCES users(id)
);

-- Teams テーブル (修正版)
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  discord_invite_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'disbanded')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idea_id) REFERENCES ideas(id)
);

-- Team Members テーブル
CREATE TABLE IF NOT EXISTS team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'member')),
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, user_id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Works テーブル (修正版)
CREATE TABLE IF NOT EXISTS works (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  demo_url TEXT,
  repository_url TEXT,
  technologies TEXT, -- JSON形式 ["React", "Node.js"]
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'published')),
  submitted_at DATETIME,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Votes テーブル
CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(work_id, user_id),
  FOREIGN KEY (work_id) REFERENCES works(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Idea Likes テーブル
CREATE TABLE IF NOT EXISTS idea_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(idea_id, user_id),
  FOREIGN KEY (idea_id) REFERENCES ideas(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notifications テーブル
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('application', 'team_invite', 'application_status', 'new_idea', 'vote', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data TEXT, -- JSON形式で関連データを保存 {"ideaId": 1, "teamId": 2}
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Project Activities テーブル (プロジェクト活動ログ)
CREATE TABLE IF NOT EXISTS project_activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL, -- ideas.id を参照
  activity_type TEXT NOT NULL CHECK (activity_type IN ('status_change', 'deadline_set', 'progress_update', 'member_join', 'member_leave')),
  description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER NOT NULL, -- users.id を参照
  FOREIGN KEY (project_id) REFERENCES ideas(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ==============================================
-- インデックス作成（パフォーマンス向上のため）
-- ==============================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Ideas
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at);

-- Applications
CREATE INDEX IF NOT EXISTS idx_applications_idea_id ON applications(idea_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Teams
CREATE INDEX IF NOT EXISTS idx_teams_idea_id ON teams(idea_id);
CREATE INDEX IF NOT EXISTS idx_teams_status ON teams(status);

-- Team Members
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);

-- Works
CREATE INDEX IF NOT EXISTS idx_works_team_id ON works(team_id);
CREATE INDEX IF NOT EXISTS idx_works_status ON works(status);

-- Votes
CREATE INDEX IF NOT EXISTS idx_votes_work_id ON votes(work_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

-- Idea Likes
CREATE INDEX IF NOT EXISTS idx_idea_likes_idea_id ON idea_likes(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_likes_user_id ON idea_likes(user_id);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Project Activities
CREATE INDEX IF NOT EXISTS idx_project_activities_project_id ON project_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_project_activities_created_by ON project_activities(created_by);
CREATE INDEX IF NOT EXISTS idx_project_activities_activity_type ON project_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_project_activities_created_at ON project_activities(created_at);
