import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { ReactNode } from 'react'

interface PrivateRouteProps {
    children: ReactNode
}

function PrivateRoute({ children }: PrivateRouteProps) {
    const { isLoggedIn } = useAuth()

    if (!isLoggedIn) {
        // ログインしていない場合はログインページにリダイレクト
        return <Navigate to="/login" replace />
    }

    // ログインしている場合は子コンポーネントを表示
    return <>{children}</>
}

export default PrivateRoute
