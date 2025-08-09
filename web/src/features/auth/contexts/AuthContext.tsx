/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../../../generated'
import { authApi, updateApiConfiguration } from '../../../lib/api'

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: () => void
  logout: () => void
  isAuthenticated: boolean
  jwtToken: string | null
  setAuthData: (userData: User, token: string) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [jwtToken, setJwtToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = true // 一時的に常にログイン状態にする

  useEffect(() => {
    // Check for stored JWT token and user data on mount
    const storedToken = localStorage.getItem('jwt_token')
    const storedUser = localStorage.getItem('user_data')
    
    if (storedToken && storedUser) {
      try {
        setJwtToken(storedToken)
        setUser(JSON.parse(storedUser))
        updateApiConfiguration() // Update API clients with token
      } catch (error) {
        console.error('Failed to parse stored user data:', error)
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('user_data')
        localStorage.removeItem('github_access_token') // Clean old token
        localStorage.removeItem('github_user') // Clean old user data
      }
    } else {
      // Try to fetch user info if we have a token but no user data
      if (storedToken) {
        fetchCurrentUser(storedToken)
      }
    }
    setIsLoading(false)
  }, [])

  const fetchCurrentUser = async (token: string) => {
    try {
      setJwtToken(token)
      updateApiConfiguration()
      const response = await authApi.apiAuthMeGet()
      setUser(response.data.user || null)
      if (response.data.user) {
        localStorage.setItem('user_data', JSON.stringify(response.data.user))
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error)
      // Token might be invalid, clear it
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('user_data')
      setJwtToken(null)
      setUser(null)
    }
  }

  const login = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
    const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI
    
    if (!clientId || !redirectUri) {
      console.error('GitHub OAuth configuration missing. Please set VITE_GITHUB_CLIENT_ID and VITE_GITHUB_REDIRECT_URI')
      return
    }

    const scope = 'read:user user:email'
    const state = Math.random().toString(36).substring(7)
    
    // Store state for verification
    sessionStorage.setItem('oauth_state', state)
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`
    
    window.location.href = authUrl
  }

  const logout = () => {
    setUser(null)
    setJwtToken(null)
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('github_user') // Clean old data
    localStorage.removeItem('github_access_token') // Clean old data
    sessionStorage.removeItem('oauth_state')
    updateApiConfiguration() // Update API clients without token
  }

  // Function to set authentication data (called from callback page)
  const setAuthData = (userData: User, token: string) => {
    setUser(userData)
    setJwtToken(token)
    localStorage.setItem('jwt_token', token)
    localStorage.setItem('user_data', JSON.stringify(userData))
    updateApiConfiguration()
  }

  const value = {
    user,
    jwtToken,
    isLoading,
    login,
    logout,
    isAuthenticated,
    setAuthData
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}