import { useState, useEffect } from 'react'
import { Notification } from '../contexts/NotificationContext'

interface NotificationHistoryItem extends Notification {
  isRead: boolean
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<NotificationHistoryItem[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    // LocalStorageから通知履歴を読み込み
    const savedNotifications = localStorage.getItem('notificationHistory')
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications)
        setNotifications(parsedNotifications)
      } catch (error) {
        console.error('通知履歴の読み込みに失敗しました:', error)
      }
    } else {
      // 初回ロード時のサンプルデータ
      const sampleNotifications: NotificationHistoryItem[] = [
        {
          id: '1',
          type: 'info',
          title: 'プロジェクトに参加要望があります',
          message: 'ユーザー「田中太郎」さんがあなたのプロジェクト「ECサイト構築」への参加を希望しています',
          createdAt: new Date(Date.now() - 3600000), // 1時間前
          isRead: false
        },
        {
          id: '2',
          type: 'success',
          title: 'ダイレクトメッセージ',
          message: '佐藤花子さんからメッセージが届いています',
          createdAt: new Date(Date.now() - 7200000), // 2時間前
          isRead: false
        },
        {
          id: '3',
          type: 'info',
          title: '下書きを保存しました',
          message: '入力内容が保存されました',
          createdAt: new Date(Date.now() - 86400000), // 1日前
          isRead: true
        }
      ]
      setNotifications(sampleNotifications)
    }
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  // LocalStorageに保存
  useEffect(() => {
    localStorage.setItem('notificationHistory', JSON.stringify(notifications))
  }, [notifications])

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead)

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}日前`
    if (diffHours > 0) return `${diffHours}時間前`
    return `${Math.floor(diffMs / (1000 * 60))}分前`
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✓'
      case 'error': return '✕'
      case 'warning': return '⚠'
      case 'info': return 'ℹ'
      default: return 'ℹ'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500'
      case 'error': return 'text-red-500'
      case 'warning': return 'text-yellow-500'
      case 'info': return 'text-blue-500'
      default: return 'text-blue-500'
    }
  }

  return (
    <div className="w-full flex justify-center p-6">
      <div className="max-w-4xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">通知一覧</h1>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              すべて既読にする
            </button>
          )}
          <button
            onClick={clearAll}
            className="px-4 py-2 text-red-600 hover:text-red-800 font-medium"
          >
            すべて削除
          </button>
        </div>
      </div>

      {/* フィルター */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-medium ${
              filter === 'all' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            すべて ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 font-medium ${
              filter === 'unread' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            未読 ({unreadCount})
          </button>
        </div>
      </div>

      {/* 通知一覧 */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>{filter === 'unread' ? '未読の通知はありません' : '通知がありません'}</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200 ${
                !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 text-xl ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                      <span className="text-sm text-gray-500">
                        {getTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                  {notification.message && (
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                  )}
                  <div className="flex space-x-4 mt-3">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        既読にする
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  )
}

export default NotificationList