/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextType {
    isLoggedIn: boolean
    login: () => void
    logout: () => void
    user: { username: string } | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState<{ username: string } | null>(null)

    const login = () => {
        // モック認証 - 後でGitHub OAuthに置き換え
        setIsLoggedIn(true)
        setUser({ username: 'testuser' })
    }

    const logout = () => {
        setIsLoggedIn(false)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext
