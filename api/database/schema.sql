-- ======================================
-- RAIDHack Platform Database Schema
-- Cloudflare D1 SQLite Database
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

-- Applications テーブル
CREATE TABLE applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER NOT NULL REFERENCES ideas(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(idea_id, user_id) -- 同じアイデアに同じユーザーは1回のみ応募可能
);

-- Teams テーブル
CREATE TABLE teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER UNIQUE NOT NULL REFERENCES ideas(id), -- 1つのアイデアに1つのチーム
  discord_url TEXT,
  status TEXT DEFAULT 'forming' CHECK (status IN ('forming', 'active', 'completed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

-- Works テーブル
CREATE TABLE works (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT, -- JSON形式 ["React", "Node.js"]
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  idea_id INTEGER REFERENCES ideas(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Work Team Members テーブル
CREATE TABLE work_team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_id INTEGER NOT NULL REFERENCES works(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(work_id, user_id) -- 同じ作品に同じユーザーは1回のみ参加可能
);

-- Likes テーブル（アイデアへのいいね）
CREATE TABLE idea_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER NOT NULL REFERENCES ideas(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(idea_id, user_id) -- 同じアイデアに同じユーザーは1回のみいいね可能
);

-- Votes テーブル（成果物への投票）
CREATE TABLE work_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_id INTEGER NOT NULL REFERENCES works(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(work_id, user_id) -- 同じ成果物に同じユーザーは1回のみ投票可能
);

-- ======================================
-- インデックス作成
-- ======================================

-- Users テーブル用インデックス
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Ideas テーブル用インデックス
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created_at ON ideas(created_at);

-- Applications テーブル用インデックス
CREATE INDEX idx_applications_idea_id ON applications(idea_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Teams テーブル用インデックス
CREATE INDEX idx_teams_idea_id ON teams(idea_id);

-- Team Members テーブル用インデックス
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- Works テーブル用インデックス
CREATE INDEX idx_works_idea_id ON works(idea_id);
CREATE INDEX idx_works_created_at ON works(created_at);

-- Work Team Members テーブル用インデックス
CREATE INDEX idx_work_team_members_work_id ON work_team_members(work_id);
CREATE INDEX idx_work_team_members_user_id ON work_team_members(user_id);

-- Likes テーブル用インデックス
CREATE INDEX idx_idea_likes_idea_id ON idea_likes(idea_id);
CREATE INDEX idx_idea_likes_user_id ON idea_likes(user_id);

-- Votes テーブル用インデックス
CREATE INDEX idx_work_votes_work_id ON work_votes(work_id);
CREATE INDEX idx_work_votes_user_id ON work_votes(user_id);

-- ======================================
-- トリガー（updated_at自動更新）
-- ======================================

CREATE TRIGGER update_users_updated_at 
AFTER UPDATE ON users 
BEGIN 
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_ideas_updated_at 
AFTER UPDATE ON ideas 
BEGIN 
  UPDATE ideas SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_works_updated_at 
AFTER UPDATE ON works 
BEGIN 
  UPDATE works SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
