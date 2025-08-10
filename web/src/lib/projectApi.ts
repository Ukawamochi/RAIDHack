import { ideasApi } from './api'
import { ProjectsApi, Configuration } from '../generated'

// 認証付きの ProjectsApi インスタンスを毎回作る（最新トークン反映のため）
const API_BASE_URL = import.meta.env.VITE_API_BASE || 'https://raidhack-api.ukawamochi5.workers.dev'
const getProjectsApi = () => {
  const token = localStorage.getItem('jwt_token') || undefined
  return new ProjectsApi(new Configuration({ basePath: API_BASE_URL, accessToken: token }))
}

export interface ProjectData {
  id: number
  title: string
  description: string
  status: 'open' | 'development' | 'completed'
  hostId: number
  hostName: string
  githubUrl?: string
  demoUrl?: string
  otherLinks?: Array<{ title: string; url: string }>
  members: Array<{
    id: number
    name: string
    avatar?: string
    role: string
    joinedAt: string
  }>
  applicants: Array<{
    id: number
    userId: number
    username: string
    avatar?: string
    message?: string
    motivation?: string
    appliedAt: string
  }>
  isRecruitingEnabled: boolean
  maxMembers: number
  progressPercentage: number
  createdAt: string
  updatedAt: string
  startDate?: string
  deadline?: string
}

export interface ChatMessage {
  id: number
  userId: number
  userName: string
  message: string
  timestamp: string
  type: 'public' | 'private'
}

export interface ProjectSettings {
  is_recruiting?: boolean
  github_url?: string
  demo_url?: string
  other_links?: Array<{ title: string; url: string }>
  max_members?: number
}

// プロジェクト詳細取得 - 新しいProjectsApiを使用
export const getProject = async (userId: string, projectName: string): Promise<ProjectData> => {
  try {
    // 直接ProjectsApiでプロジェクト詳細を取得
  const response = await getProjectsApi().apiProjectsUserIdProjectIdGet(userId, encodeURIComponent(projectName))
    const projectDetail = response.data.project
    if (!projectDetail) {
      throw new Error('プロジェクト詳細が取得できませんでした')
    }
    
    return {
      id: projectDetail.id,
      title: projectDetail.title,
      description: projectDetail.description,
      status: projectDetail.status,
      hostId: projectDetail.hostId,
      hostName: projectDetail.hostName,
      githubUrl: projectDetail.githubUrl,
      demoUrl: projectDetail.demoUrl,
      otherLinks: (projectDetail.otherLinks || [])
        .map((l) => ({ title: l.title ?? '', url: l.url ?? '' }))
        .filter((l) => l.title && l.url),
      members: (projectDetail.members || [])
        .filter((m) => m.id != null && m.name && m.role && m.joinedAt)
        .map((m) => ({
          id: m.id as number,
          name: m.name as string,
          avatar: m.avatar,
          role: m.role as string,
          joinedAt: m.joinedAt as string,
        })),
      applicants: (projectDetail.applicants || [])
        .filter((a) => a.id != null && a.userId != null && a.username && a.appliedAt)
        .map((a) => ({
          id: a.id as number,
          userId: a.userId as number,
          username: a.username as string,
          avatar: a.avatar,
          message: a.message,
          motivation: a.motivation,
          appliedAt: a.appliedAt as string,
        })),
      isRecruitingEnabled: projectDetail.isRecruitingEnabled,
      maxMembers: projectDetail.maxMembers,
      progressPercentage: projectDetail.progressPercentage,
      createdAt: projectDetail.createdAt,
      updatedAt: projectDetail.updatedAt,
      startDate: projectDetail.startDate,
      deadline: projectDetail.deadline
    }
  } catch (error) {
  console.warn('ProjectsApiでの取得に失敗:', error)
  throw error
  }
}

// プロジェクト設定更新（ProjectsApiを使用）
export const updateProjectSettings = async (
  userId: string,
  projectId: string,
  settings: ProjectSettings
): Promise<void> => {
  await getProjectsApi().apiProjectsUserIdProjectIdSettingsPut(userId, encodeURIComponent(projectId), settings)
}

// プロジェクトステータス更新（IdeasApiにはステータス更新がないため、カスタムAPIクライアントを使用）
export const updateProjectStatus = async (
  projectId: number,
  status: 'open' | 'development' | 'completed',
  startDate?: string
): Promise<void> => {
  // TODO: OpenAPIスキーマにステータス更新エンドポイントを追加する必要がある
  console.warn('ステータス更新機能は未実装です')
}

// 募集設定の切り替え（ProjectsApiを使用）
export const toggleRecruiting = async (
  userId: string,
  projectId: string,
  isRecruiting: boolean
): Promise<void> => {
  await updateProjectSettings(userId, projectId, { is_recruiting: isRecruiting })
}

// プロジェクトメッセージ取得（ProjectsApiを使用）
export const getProjectMessages = async (
  userId: string,
  projectId: string,
  type: 'public' | 'private' = 'public',
  limit = 50,
  offset = 0
): Promise<ChatMessage[]> => {
  const response = await getProjectsApi().apiProjectsUserIdProjectIdMessagesGet(
    userId, 
    encodeURIComponent(projectId), 
    type, 
    limit, 
    offset
  )
  return (response.data.messages || []) as ChatMessage[]
}

// プロジェクトメッセージ送信（ProjectsApiを使用）
export const sendProjectMessage = async (
  userId: string,
  projectId: string,
  message: string,
  messageType: 'public' | 'private' = 'public',
  recipients?: number[]
): Promise<void> => {
  await getProjectsApi().apiProjectsUserIdProjectIdMessagesPost(
    userId, 
    encodeURIComponent(projectId), 
    {
      message,
      message_type: messageType,
      recipients
    }
  )
}

// 応募承認/拒否（ProjectsApiを使用）
export const processApplication = async (
  userId: string,
  projectName: string,
  applicationId: number,
  action: 'approve' | 'reject',
  message?: string
): Promise<void> => {
  await getProjectsApi().apiProjectsUserIdProjectIdApplicationsApplicationIdPut(
    userId,
    encodeURIComponent(projectName),
    applicationId,
    { action, message: message || '' }
  )
}

// プロジェクトへの参加申請（OpenAPI IdeasApiを使用）
export const applyToProject = async (
  projectId: number,
  message?: string,
  motivation?: string
): Promise<void> => {
  await ideasApi.apiIdeasIdApplyPost(projectId, {
    message: message || '',
    motivation: motivation || ''
  })
}