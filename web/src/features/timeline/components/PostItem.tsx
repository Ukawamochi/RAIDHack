import { useState } from 'react'
import { IdeaDetail, ApiIdeasIdApplyPostRequest, IdeaDetailStatusEnum } from '../../../generated'
import { useAuth } from '../../auth'
import { useTimeline } from '../../../contexts/TimelineContext'
import { ideasApi } from '../../../lib/api'

interface PostItemProps {
  post: IdeaDetail
}

function PostItem({ post }: PostItemProps) {
  const { user, isAuthenticated } = useAuth()
  const { triggerRefresh } = useTimeline()
  const [likeCount, setLikeCount] = useState(post.like_count || 0)
  const [userLiked, setUserLiked] = useState(post.user_liked || false)
  
  const isOwner = isAuthenticated && user?.id === post.user?.id
  const isRecruitmentClosed = post.status !== IdeaDetailStatusEnum.Open
  
  const handleLike = async () => {
    if (!isAuthenticated || !post.id) return
    
    try {
      await ideasApi.apiIdeasIdLikePost(post.id)
      setUserLiked(!userLiked)
      setLikeCount(prev => userLiked ? prev - 1 : prev + 1)
    } catch (error) {
      console.error('いいねの処理に失敗しました:', error)
    }
  }

  const handleComment = () => {
    if (!isAuthenticated) return
    console.log('コメント機能を実装予定')
  }

  const handleJoin = async () => {
    if (!isAuthenticated || isOwner || isRecruitmentClosed || !post.id) return
    
    try {
      const request: ApiIdeasIdApplyPostRequest = {
        message: 'プロジェクトに参加したいです！'
      }
      await ideasApi.apiIdeasIdApplyPost(post.id, request)
      console.log('参加申請を送信しました')
    } catch (error) {
      console.error('参加処理に失敗しました:', error)
    }
  }

  const handleFork = async () => {
    if (!isAuthenticated || isOwner || !post.id) return
    
    try {
      // Fork機能はアイデアを複製して新しいアイデアとして投稿
      const forkRequest = {
        title: `${post.title} (Fork)`,
        description: post.description || '',
        required_skills: post.required_skills || []
      }
      await ideasApi.apiIdeasPost(forkRequest)
      console.log('アイデアをforkしました')
      
      // TLを更新
      triggerRefresh()
    } catch (error) {
      console.error('fork処理に失敗しました:', error)
    }
  }

  const getStatusLabel = () => {
    if (isOwner) return 'ホスト'
    if (post.applications && post.applications.some(app => app.user?.id === user?.id)) return '参加'
    
    // ステータスに基づくラベル
    switch (post.status) {
      case IdeaDetailStatusEnum.Open:
        return '募集中'
      case IdeaDetailStatusEnum.Development:
        return '開発中'
      case IdeaDetailStatusEnum.Completed:
        return '完了'
      default:
        return 'Fork'
    }
  }

  const getStatusColor = () => {
    if (isOwner) return 'bg-blue-500'
    if (post.applications && post.applications.some(app => app.user?.id === user?.id)) return 'bg-green-500'
    
    // ステータスに基づく色
    switch (post.status) {
      case IdeaDetailStatusEnum.Open:
        return 'bg-green-600'
      case IdeaDetailStatusEnum.Development:
        return 'bg-yellow-500'
      case IdeaDetailStatusEnum.Completed:
        return 'bg-gray-500'
      default:
        return 'bg-gray-400'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1日前'
    if (diffDays < 7) return `${diffDays}日前`
    if (diffDays < 14) return '1週間前'
    return `${Math.floor(diffDays / 7)}週間前`
  }

  return (
    <div className="w-full flex items-start space-x-4 p-4 border-b border-gray-600">
      {/* アバター（緑の境界線） */}
      <div className="w-12 h-12 rounded-full flex-shrink-0 relative">
        <div className="w-full h-full bg-gray-300 rounded-full">
          {post.user?.avatar_url && (
            <img 
              src={post.user.avatar_url} 
              alt={post.user.username || 'User'} 
              className="w-full h-full rounded-full object-cover"
            />
          )}
        </div>
        {/* 緑の境界線（募集中の場合） */}
        {post.status === IdeaDetailStatusEnum.Open && (
          <div className="absolute inset-0 border-2 border-green-500 rounded-full"></div>
        )}
      </div>
      
      {/* メインコンテンツ */}
      <div className="flex-1 min-w-0">
        {/* 上部：ステータスバッジと投稿時間・タグ */}
        <div className="flex items-start justify-between mb-2">
          <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-400 mb-1">{formatDate(post.created_at)}</span>
            {/* 技術タグ */}
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">#Java</span>
              <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">#JavaScript</span>
              <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">#JS</span>
              <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">#Webアプリ</span>
              <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">#Node.js</span>
            </div>
          </div>
        </div>
        
        {/* ユーザー名 */}
        <div className="text-sm text-gray-300 mb-1">
          ユーザー名: {post.user?.username || '不明'}
        </div>
        
        {/* プロジェクトタイトル */}
        <h3 className="text-white font-medium text-lg mb-2">{post.title}</h3>
        
        {/* アクションボタン（プロジェクト名の直下） */}
        <div className="flex space-x-2 mb-3">
          {/* いいねボタン */}
          <button
            onClick={handleLike}
            disabled={!isAuthenticated}
            className={`p-1 rounded transition-colors ${
              userLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
            } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={userLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          
          {/* コメントボタン */}
          <button
            onClick={handleComment}
            disabled={!isAuthenticated}
            className={`p-1 rounded transition-colors text-gray-400 hover:text-blue-400 ${
              !isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
          
          {/* 参加ボタン */}
          {!isOwner && (
            <button
              onClick={handleJoin}
              disabled={!isAuthenticated || isRecruitmentClosed}
              className={`p-1 rounded transition-colors ${
                isRecruitmentClosed || !isAuthenticated
                  ? 'opacity-50 cursor-not-allowed text-gray-500'
                  : 'text-gray-400 hover:text-green-400 cursor-pointer'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </button>
          )}
          
          {/* forkボタン */}
          {!isOwner && (
            <button
              onClick={handleFork}
              disabled={!isAuthenticated}
              className={`p-1 rounded transition-colors text-gray-400 hover:text-purple-400 ${
                !isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="18" r="3"/>
                <circle cx="6" cy="6" r="3"/>
                <circle cx="18" cy="6" r="3"/>
                <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/>
                <path d="M12 12v3"/>
              </svg>
            </button>
          )}
        </div>
        
        {/* 参加者アイコン */}
        <div className="flex items-center space-x-1">
          {post.applications?.slice(0, 4).map((application, index) => (
            <div key={index} className="w-6 h-6 bg-white rounded-full border-2 border-gray-500"></div>
          ))}
          {post.applications && post.applications.length > 4 && (
            <span className="text-sm text-gray-400 ml-2">+{post.applications.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostItem