import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth'

function NewPostPage() {
    const { isAuthenticated } = useAuth()
    
    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }
    
    return (
        <h1>アイデアの投稿(準備中)</h1>
    )
}

export default NewPostPage
