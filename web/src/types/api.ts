// Re-export commonly used types from generated client
export type {
  User,
  Team,
  Work,
  Application,
  Notification,
  SuccessResponse,
  ErrorResponse,
  Pagination
} from '../generated'

import { Idea as GeneratedIdea } from '../generated'

// Extended Idea type with new fields for project management
export interface Idea extends Omit<GeneratedIdea, 'status'> {
  status: 'open' | 'development' | 'completed'
  start_date?: string // レイド開始日
  deadline?: string // 期限
  progress_percentage?: number // 進捗率(0-100)
  username?: string // 作成者名
  avatar_url?: string // 作成者のアバター
  user_liked?: boolean // ユーザーがいいねしているか
}