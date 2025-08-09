/// <reference types="../worker-configuration" />

// ====================
// Environment & Context Types
// ====================
export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

export interface AppContext {
  Bindings: Env;
  Variables: {
    userId?: number;
    user?: User;
  };
}

// ====================
// API Response Types
// ====================
export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

// ====================
// User Types
// ====================
export interface User {
  id: number;
  email: string;
  username: string;
  bio?: string;
  skills: string[];
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: true;
  message: string;
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  bio?: string;
  skills?: string[];
}

export interface UpdateProfileRequest {
  username?: string;
  bio?: string;
  skills?: string[];
}

// ====================
// Idea Types
// ====================
export interface Idea {
  id: number;
  title: string;
  description: string;
  required_skills: string[];
  user_id: number;
  status: 'open' | 'development' | 'completed';
  start_date?: string; // レイド開始日
  deadline?: string; // 期限
  progress_percentage: number; // 進捗率(0-100)
  created_at: string;
  updated_at: string;
  // Extended properties for responses
  username?: string;
  avatar_url?: string;
  like_count?: number;
  user_liked?: boolean;
}

export interface CreateIdeaRequest {
  title: string;
  description: string;
  required_skills: string[];
}

export interface IdeasResponse {
  success: true;
  message?: string;
  ideas: Idea[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IdeaResponse {
  success: true;
  message?: string;
  idea: Idea;
}

export interface UpdateIdeaStatusRequest {
  status: 'open' | 'development' | 'completed';
  start_date?: string; // development状態になる時に設定
}

export interface UpdateIdeaDeadlineRequest {
  deadline: string;
}

export interface UpdateIdeaProgressRequest {
  progress_percentage: number;
}

// ====================
// Project Activity Types
// ====================
export interface ProjectActivity {
  id: number;
  project_id: number;
  activity_type: 'status_change' | 'deadline_set' | 'progress_update' | 'member_join' | 'member_leave';
  description: string;
  created_at: string;
  created_by: number;
}

// ====================
// Application Types
// ====================
export interface Application {
  id: number;
  idea_id: number;
  applicant_id: number;
  message?: string;
  motivation?: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  reviewed_at?: string;
  review_message?: string;
}

export interface ApplicationWithDetails extends Application {
  idea: {
    id: number;
    title: string;
    description: string;
    author: string;
  };
  applicant?: {
    id: number;
    username: string;
    email: string;
    bio?: string;
    skills: string[];
    avatar_url?: string;
  };
}

// ====================
// Team Types
// ====================
export interface Team {
  id: number;
  idea_id: number;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'disbanded';
  discord_invite_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: number;
  team_id: number;
  user_id: number;
  role: 'leader' | 'member';
  joined_at: string;
}

export interface TeamWithMembers extends Team {
  members: (TeamMember & User)[];
  idea: Idea;
}

// ====================
// Work Types
// ====================
export interface Work {
  id: number;
  team_id: number;
  title: string;
  description: string;
  demo_url?: string;
  repository_url?: string;
  technologies: string[];
  status: 'draft' | 'submitted' | 'published';
  submitted_at?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkWithTeam extends Work {
  team: TeamWithMembers;
  vote_count: number;
  user_voted?: boolean;
}

export interface CreateWorkRequest {
  title: string;
  description: string;
  demo_url?: string;
  repository_url?: string;
  technologies: string[];
}

// ====================
// Work Response Types
// ====================
export interface WorksResponse {
  success: true;
  message?: string;
  works: WorkWithTeam[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WorkResponse {
  success: true;
  message?: string;
  work: WorkWithTeam;
}

// ====================
// Vote Types
// ====================
export interface Vote {
  id: number;
  work_id: number;
  user_id: number;
  voted_at: string;
}