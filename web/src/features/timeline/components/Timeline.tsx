import { useState, useEffect, useCallback } from 'react'
import { IdeaDetail } from '../../../generated'
import { ideasApi } from '../../../lib/api'
import { useTimeline } from '../../../contexts/TimelineContext'
import PostItem from './PostItem'

interface TimelineProps {
  className?: string
}

function Timeline({ className = '' }: TimelineProps) {
  const { refreshTrigger } = useTimeline()
  const [posts, setPosts] = useState<IdeaDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ideasApi.apiIdeasGet()
      setPosts(response.data.ideas || [])
    } catch (err) {
      setError('投稿の取得に失敗しました')
      console.error('Failed to fetch posts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts, refreshTrigger]) // refreshTriggerが変わったら再取得

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex justify-center items-center py-8">
          <div className="text-white">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="flex justify-center items-center py-8">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {posts.length === 0 && !loading ? (
        <div className="p-8 text-center">
          <div className="text-gray-300 mb-2">投稿がありません</div>
          <div className="text-sm text-gray-500">最初の投稿をしてみましょう！</div>
        </div>
      ) : (
        posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))
      )}
    </div>
  )
}

export default Timeline