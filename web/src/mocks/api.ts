import { mockTimelinePosts, getCurrentUserApplications, getCurrentUserLikes } from './timelineData'
import { IdeaDetail, ApiIdeasGet200Response, ApiIdeasIdLikePost200Response, ApiIdeasIdApplyPost201Response, ApiIdeasPost201Response } from '../generated'

// Mock API delay to simulate network
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms))

export class MockTimelineApi {
  private posts: IdeaDetail[] = [...mockTimelinePosts]
  private userLikes: Record<number, boolean> = {}
  private currentUserId: number = 1 // Mock current user ID

  constructor() {
    // Initialize mock user interactions
    this.userLikes = getCurrentUserLikes(this.currentUserId)
  }

  async apiIdeasGet(page?: number, limit?: number): Promise<{ data: ApiIdeasGet200Response }> {
    await delay()
    
    const startIndex = ((page || 1) - 1) * (limit || 10)
    const endIndex = startIndex + (limit || 10)
    const paginatedPosts = this.posts.slice(startIndex, endIndex)
    
    return {
      data: {
        success: true,
        data: paginatedPosts,
        pagination: {
          page: page || 1,
          limit: limit || 10,
          total: this.posts.length,
          total_pages: Math.ceil(this.posts.length / (limit || 10))
        }
      }
    }
  }

  async apiIdeasIdLikePost(id: number): Promise<{ data: ApiIdeasIdLikePost200Response }> {
    await delay(300)
    
    const post = this.posts.find(p => p.id === id)
    if (!post) {
      throw new Error('Post not found')
    }

    const isCurrentlyLiked = this.userLikes[id] || false
    this.userLikes[id] = !isCurrentlyLiked

    // Update like count
    if (this.userLikes[id]) {
      post.likeCount = (post.likeCount || 0) + 1
    } else {
      post.likeCount = Math.max((post.likeCount || 0) - 1, 0)
    }

    return {
      data: {
        success: true,
        message: this.userLikes[id] ? 'いいねしました' : 'いいねを取り消しました',
        liked: this.userLikes[id],
        like_count: post.likeCount
      }
    }
  }

  async apiIdeasIdApplyPost(id: number, request: { message: string }): Promise<{ data: ApiIdeasIdApplyPost201Response }> {
    await delay(500)
    
    const post = this.posts.find(p => p.id === id)
    if (!post) {
      throw new Error('Post not found')
    }

    if (!post.isRecruiting) {
      throw new Error('この投稿は募集を締め切っています')
    }

    // Check if user already applied
    const existingApplication = post.applications?.find(app => app.user?.id === this.currentUserId)
    if (existingApplication) {
      throw new Error('既に応募済みです')
    }

    // Add new application
    const newApplication = {
      id: Date.now(),
      user: { id: this.currentUserId, username: 'current_user' },
      status: 'pending' as const,
      message: request.message
    }

    if (!post.applications) {
      post.applications = []
    }
    post.applications.push(newApplication)

    return {
      data: {
        success: true,
        message: '応募しました！',
        application: newApplication
      }
    }
  }

  async apiIdeasPost(request: { title: string; description: string; tags?: string[]; isRecruiting: boolean }): Promise<{ data: ApiIdeasPost201Response }> {
    await delay(700)
    
    const newPost: IdeaDetail = {
      id: Date.now(),
      title: request.title,
      description: request.description,
      isRecruiting: request.isRecruiting,
      user: { id: this.currentUserId, username: 'current_user' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: request.tags || [],
      applications: [],
      likeCount: 0
    }

    this.posts.unshift(newPost) // Add to beginning of timeline

    return {
      data: {
        success: true,
        message: 'アイデアを投稿しました！',
        data: newPost
      }
    }
  }

  // Helper methods for getting user interaction state
  isPostLikedByCurrentUser(postId: number): boolean {
    return this.userLikes[postId] || false
  }

  hasUserAppliedToPost(postId: number): boolean {
    const post = this.posts.find(p => p.id === postId)
    return post?.applications?.some(app => app.user?.id === this.currentUserId) || false
  }

  isPostOwnedByCurrentUser(postId: number): boolean {
    const post = this.posts.find(p => p.id === postId)
    return post?.user?.id === this.currentUserId || false
  }
}

export const mockTimelineApi = new MockTimelineApi()