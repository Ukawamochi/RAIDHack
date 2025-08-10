import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth'
import { NewProjectForm } from '../features/new'

function NewPostPage() {
    const { isAuthenticated } = useAuth()
    
    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }
    
    return <NewProjectForm />
}

export default NewPostPage
