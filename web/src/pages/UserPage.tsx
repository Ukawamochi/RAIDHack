import { useState, useEffect, useCallback } from 'react'
import { IdeaDetail } from '../generated'
import { ideasApi } from '../lib/api'
import { useAuth } from '../features/auth'
import { useTimeline } from '../contexts/TimelineContext'
import PostItem from '../features/timeline/components/PostItem'

function UserPage() {
  const { user, isAuthenticated } = useAuth()
  const { refreshTrigger } = useTimeline()
  const [myPosts, setMyPosts] = useState<IdeaDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMyPosts = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setMyPosts([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await ideasApi.apiIdeasGet()

      // 自分が投稿したプロジェクトのみをフィルタリング
      const allPosts = response.data.ideas || []
      const userPosts = allPosts.filter(post => post.user_id === user.id)

      setMyPosts(userPosts)
    } catch (err) {
      setError('投稿の取得に失敗しました')
      console.error('Failed to fetch user posts:', err)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    fetchMyPosts()
  }, [fetchMyPosts, refreshTrigger])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#363A51' }}>
        <div className="flex justify-center items-center py-8">
          <div className="text-white">ログインが必要です</div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#363A51' }}>
        <div className="flex justify-center items-center py-8">
          <div className="text-white">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#363A51' }}>
        <div className="flex justify-center items-center py-8">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#363A51' }}>
      <div className="max-w py-6">
        {/* ユーザー情報ヘッダー */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-medium text-white mb-2">マイプロジェクト</h1>
          <p className="text-gray-300">{user?.username}さんが投稿したプロジェクト一覧</p>
        </div>

        {/* プロジェクト一覧 */}
        {myPosts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-300 mb-2">まだプロジェクトを投稿していません</div>
            <div className="text-sm text-gray-500">新しいプロジェクトを投稿してみましょう！</div>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-400 text-center">
              {myPosts.length}件のプロジェクトが見つかりました
            </div>
            {myPosts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserPage
