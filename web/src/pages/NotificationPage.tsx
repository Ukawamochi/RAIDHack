import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth'
import { NotificationList } from '../features/notifications'

function NotificationPage() {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return <NotificationList />
}

export default NotificationPage