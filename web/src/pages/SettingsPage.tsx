import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth'

function SettingsPage() {
    const { isAuthenticated } = useAuth()
    
    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }
    
    return (
        <h1>設定ページ (準備中)</h1>
    )
}

export default SettingsPage
