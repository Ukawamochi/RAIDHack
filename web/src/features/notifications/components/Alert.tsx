import { useEffect, useState } from 'react'
import { Notification, useNotifications } from '../contexts/NotificationContext'

interface AlertProps {
  notification: Notification
  index?: number
}

const Alert = ({ notification, index = 0 }: AlertProps) => {
  const { removeNotification } = useNotifications()
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // フェードイン
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // フェードアウトの準備
    const timer = setTimeout(() => {
      setIsLeaving(true)
      // フェードアウト完了後に削除
      setTimeout(() => removeNotification(notification.id), 300)
    }, (notification.duration || 3000) - 300)

    return () => clearTimeout(timer)
  }, [notification.id, notification.duration, removeNotification])

  const getAlertStyles = () => {
    const baseStyles = {
      success: 'bg-green-500 border-green-600',
      error: 'bg-red-500 border-red-600', 
      warning: 'bg-yellow-500 border-yellow-600',
      info: 'bg-blue-500 border-blue-600'
    }
    return baseStyles[notification.type]
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <span className="text-xl">✓</span>
      case 'error':
        return <span className="text-xl">✕</span>
      case 'warning':
        return <span className="text-xl">⚠</span>
      case 'info':
        return <span className="text-xl">ℹ</span>
    }
  }

  return (
    <div
      className={`
        relative bg-opacity-95 backdrop-blur-sm border-l-4 p-4 rounded-lg shadow-lg text-white min-w-80 max-w-96
        transform transition-all duration-300 ease-in-out
        ${getAlertStyles()}
        ${isVisible && !isLeaving 
          ? 'translate-y-0 opacity-100' 
          : isLeaving 
            ? '-translate-y-4 opacity-0' 
            : '-translate-y-4 opacity-0'
        }
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          {notification.message && (
            <p className="text-sm opacity-90 mt-1">{notification.message}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsLeaving(true)
            setTimeout(() => removeNotification(notification.id), 300)
          }}
          className="flex-shrink-0 text-white hover:opacity-70 transition-opacity duration-200"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default Alert