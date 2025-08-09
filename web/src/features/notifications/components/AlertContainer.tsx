import { useNotifications } from '../contexts/NotificationContext'
import Alert from './Alert'

const AlertContainer = () => {
  const { notifications } = useNotifications()

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <div 
            key={notification.id}
            className="transform transition-all duration-300 ease-out pointer-events-auto"
            style={{ 
              transform: `translateY(${index * 4}px) scale(${1 - index * 0.02})`,
              zIndex: 1000 - index,
              opacity: Math.max(0.8, 1 - index * 0.1)
            }}
          >
            <Alert notification={notification} index={index} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertContainer