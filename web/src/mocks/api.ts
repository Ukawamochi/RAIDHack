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
        message: 'Ideas retrieved successfully',
        ideas: paginatedPosts,
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
      post.like_count = (post.like_count || 0) + 1
    } else {
      post.like_count = Math.max((post.like_count || 0) - 1, 0)
    }

    return {
      data: {
        success: true,
        message: this.userLikes[id] ? 'いいねしました' : 'いいねを取り消しました',
        liked: this.userLikes[id]
      }
    }
  }

  async apiIdeasIdApplyPost(id: number, request: { message: string }): Promise<{ data: ApiIdeasIdApplyPost201Response }> {
    await delay(500)
    
    const post = this.posts.find(p => p.id === id)
    if (!post) {
      throw new Error('Post not found')
    }

    if (post.status !== 'open') {
      throw new Error('この投稿は募集を締め切っています')
    }

    // Check if user already applied
    const existingApplication = post.applications?.find(app => app.applicant_id === this.currentUserId)
    if (existingApplication) {
      throw new Error('既に応募済みです')
    }

    // Add new application
    const newApplication = {
      id: Date.now(),
      idea_id: id,
      applicant_id: this.currentUserId,
      status: 'pending' as const,
      message: request.message,
      applied_at: new Date().toISOString()
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

  async apiIdeasPost(request: { title: string; description: string; required_skills?: string[] }): Promise<{ data: ApiIdeasPost201Response }> {
    await delay(700)
    
    const newPost: IdeaDetail = {
      id: Date.now(),
      title: request.title,
      description: request.description,
      status: 'open',
      user_id: this.currentUserId,
      user: { id: this.currentUserId, username: 'current_user' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      required_skills: request.required_skills || [],
      applications: [],
      like_count: 0
    }

    this.posts.unshift(newPost) // Add to beginning of timeline

    return {
      data: {
        success: true,
        message: 'アイデアを投稿しました！',
        idea: newPost
      }
    }
  }

  // Helper methods for getting user interaction state
  isPostLikedByCurrentUser(postId: number): boolean {
    return this.userLikes[postId] || false
  }

  hasUserAppliedToPost(postId: number): boolean {
    const post = this.posts.find(p => p.id === postId)
    return post?.applications?.some(app => app.applicant_id === this.currentUserId) || false
  }

  isPostOwnedByCurrentUser(postId: number): boolean {
    const post = this.posts.find(p => p.id === postId)
    return post?.user?.id === this.currentUserId || false
  }
}

export const mockTimelineApi = new MockTimelineApi()