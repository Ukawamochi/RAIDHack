import { createContext, useContext, useState, ReactNode } from 'react'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number // ms
  createdAt: Date
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const MAX_NOTIFICATIONS = 5 // 最大表示数

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      duration: notificationData.duration || 3000
    }

    setNotifications(prev => {
      const newNotifications = [notification, ...prev]
      // 最大表示数を超えた場合、古い通知を削除
      return newNotifications.slice(0, MAX_NOTIFICATIONS)
    })

    // 履歴に保存
    saveToHistory(notification)

    // 自動削除
    setTimeout(() => {
      removeNotification(notification.id)
    }, notification.duration)
  }

  const saveToHistory = (notification: Notification) => {
    try {
      const savedNotifications = localStorage.getItem('notificationHistory')
      const history = savedNotifications ? JSON.parse(savedNotifications) : []
      
      const historyItem = {
        ...notification,
        isRead: false
      }
      
      const newHistory = [historyItem, ...history].slice(0, 100) // 最大100件保持
      localStorage.setItem('notificationHistory', JSON.stringify(newHistory))
    } catch (error) {
      console.error('通知履歴の保存に失敗しました:', error)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        removeNotification, 
        clearNotifications 
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}