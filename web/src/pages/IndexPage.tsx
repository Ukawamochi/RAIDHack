import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth'
import { Timeline } from '../features/timeline'

function IndexPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#363A51' }}>
      <Timeline className="max-w py-6" />
    </div>
  )
}

export default IndexPage
