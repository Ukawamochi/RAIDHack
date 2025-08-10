import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IdeaDetail, IdeaDetailStatusEnum } from '../../../generated'
import { useAuth } from '../../auth'
import { ideasApi } from '../../../lib/api'
import { useAlert } from '../../notifications'

interface PostItemProps {
  post: IdeaDetail
}

function PostItem({ post }: PostItemProps) {
  const { user, isAuthenticated } = useAuth()
  const { showError } = useAlert()
  const navigate = useNavigate()
  const [likeCount, setLikeCount] = useState(post.like_count || 0)
  const [userLiked, setUserLiked] = useState(post.user_liked || false)
  
  const isOwner = isAuthenticated && user?.id === post.user?.id
  console.log(post.user);
  
  const handleLike = async () => {
    if (!isAuthenticated) {
      showError('ログインが必要です', 'いいねするにはログインしてください')
      return
    }
    if (!post.id) return
    
    try {
      await ideasApi.apiIdeasIdLikePost(post.id)
      setUserLiked(!userLiked)
      setLikeCount(prev => userLiked ? prev - 1 : prev + 1)
    } catch (error) {
      console.error('いいねの処理に失敗しました:', error)
    }
  }


  const handlePostClick = () => {
    if (post.user?.username && post.title) {
      navigate(`/${post.user.username}/${encodeURIComponent(post.title)}`)
    }
  }


  const getStatusLabel = () => {
    if (isOwner) return 'ホスト'
    if (post.applications && post.applications.some(app => app.applicant_id === user?.id)) return '参加'
    
    // ステータスに基づくラベル
    switch (post.status) {
      case IdeaDetailStatusEnum.Open:
        return '募集中'
      case IdeaDetailStatusEnum.Development:
        return '開発中'
      case IdeaDetailStatusEnum.Completed:
        return '完了'
      default:
        return 'Invalid'
    }
  }

  const getStatusColor = () => {
    if (isOwner) return 'bg-blue-500'
    if (post.applications && post.applications.some(app => app.applicant_id === user?.id)) return 'bg-green-500'
    
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
    <div 
      className="w-full flex items-start space-x-4 p-4 border-b border-gray-600 cursor-pointer hover:bg-gray-800 transition-colors"
      onClick={handlePostClick}
    >
      {/* アバター */}
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
      <div className="flex-1 min-w-0 mr-2">
        {/* 上部：ステータス・ユーザー名と投稿時間・タグ */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-1 mt-2">
            <span className="text-lg text-white">{post.user?.username || '不明'}</span>
            <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor()}`}>
              {getStatusLabel()}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-400 mb-3">{formatDate(post.created_at)}</span>
          </div>
        </div>
        
        {/* プロジェクトタイトル */}
        <h3 className="text-white font-medium text-lg mb-4">{post.title}</h3>
        {/* 技術タグ */}
        <div className="flex flex-wrap gap-1 mb-4">
          <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">#Java</span>
          <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">#JavaScript</span>
          <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">#JS</span>
          <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">#Webアプリ</span>
          <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">#Node.js</span>
        </div>
        {/* いいねボタンといいね数 */}
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleLike()
            }}
            className={`p-1 rounded transition-colors ${
              userLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
            } cursor-pointer`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={userLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <span className="text-sm text-gray-400">{likeCount}</span>
        </div>
        
        {/* 参加者アイコン */}
        <div className="flex items-center space-x-1">
          {post.applications?.slice(0, 4).map((_, index) => (
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