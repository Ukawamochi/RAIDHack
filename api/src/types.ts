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

// ======================================
// RAIDHack Platform 型定義
// ======================================

// ユーザー関連
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

export interface AuthRequest {
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

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// アイデア関連
export interface Idea {
  id: number;
  title: string;
  description: string;
  requiredSkills: string[];
  status: 'open' | 'development' | 'completed';
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    email?: string;
    username: string;
    bio?: string;
    skills?: string[];
    avatarUrl?: string;
  };
  likeCount: number;
  userLiked: boolean;
}

// リクエスト型定義
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

export interface CreateIdeaRequest {
  title: string;
  description: string;
  requiredSkills?: string[];
}

export interface IdeasResponse {
  success: boolean;
  message: string;
  ideas: Idea[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IdeaResponse {
  success: boolean;
  message: string;
  idea: Idea;
}

// 応募関連
export interface Application {
  id: number;
  ideaId: number;
  userId: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  user?: User; // 応募者情報（JOIN結果）
  idea?: Idea; // アイデア情報（JOIN結果）
}

export interface CreateApplicationRequest {
  ideaId: number;
  message: string;
}

export interface ApplicationsResponse extends ApiResponse {
  data?: {
    applications: Application[];
  };
}

// チーム関連
export interface Team {
  id: number;
  ideaId: number;
  discordUrl?: string;
  status: 'forming' | 'active' | 'completed';
  createdAt: string;
  idea?: Idea; // 関連アイデア（JOIN結果）
  members?: TeamMember[]; // チームメンバー（JOIN結果）
}

export interface TeamMember {
  id: number;
  teamId: number;
  userId: number;
  role: 'leader' | 'member';
  joinedAt: string;
  user?: User; // ユーザー情報（JOIN結果）
}

export interface CreateTeamRequest {
  ideaId: number;
  memberIds: number[]; // 承認された応募者のID配列
}

export interface TeamResponse extends ApiResponse {
  data?: {
    team: Team;
    discordUrl?: string;
  };
}

// 成果物関連
export interface Work {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
  updatedAt: string;
  ideaId?: number;
  ideaTitle?: string;
  teamMembers: {
    id: number;
    username: string;
    email?: string;
    bio?: string;
    skills?: string[];
    avatarUrl?: string;
  }[];
  voteCount: number;
  userVoted: boolean;
}

export interface CreateWorkRequest {
  title: string;
  description: string;
  technologies?: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  ideaId?: number;
  teamMemberIds?: number[];
}

export interface WorkResponse {
  success: boolean;
  message: string;
  work: Work;
}

export interface WorksResponse {
  success: boolean;
  message: string;
  works: Work[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ページネーション
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Cloudflare Workers環境
export interface CloudflareBindings {
  // D1データベース
  DB: D1Database;
  
  // KVストレージ（セッション管理用）
  SESSIONS: KVNamespace;
  
  // 環境変数
  JWT_SECRET: string;
  DISCORD_BOT_TOKEN?: string;
}

// コンテキスト型
export interface AppContext {
  Bindings: CloudflareBindings;
  Variables: {
    user?: User;
    userId?: number;
  };
}