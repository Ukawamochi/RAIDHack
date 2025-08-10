import { useState, useEffect, useCallback } from 'react'
import { notificationsApi, ideasApi } from '../../../lib/api'
import type { Notification as ApiNotification } from '../../../generated'

type UiNotification = {
  id: number
  type: 'application' | 'team_invite' | 'application_status' | 'new_idea' | 'vote' | 'system'
  title: string
  message: string
  createdAt: Date
  isRead: boolean
  raw: ApiNotification
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<UiNotification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actingId, setActingId] = useState<number | null>(null)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await notificationsApi.apiNotificationsGet()
      const list = res.data.notifications || []
      const mapped: UiNotification[] = list.map(n => ({
        id: n.id,
        type: n.type as UiNotification['type'],
        title: n.title,
        message: n.message,
        createdAt: new Date(n.created_at),
        isRead: !!n.is_read,
        raw: n
      }))
      setNotifications(mapped)
    } catch (e: any) {
      setError(e?.message || '通知の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const markAsRead = async (id: number) => {
    try {
      await notificationsApi.apiNotificationsIdReadPut(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (e) {
      console.error(e)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationsApi.apiNotificationsReadAllPut()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (e) {
      console.error(e)
    }
  }

  const deleteNotification = async (id: number) => {
    try {
      await notificationsApi.apiNotificationsIdDelete(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const clearAll = async () => {
    // まとめて削除APIが無いので、フロント側で全削除
    const ids = notifications.map(n => n.id)
    for (const id of ids) {
      try { await notificationsApi.apiNotificationsIdDelete(id) } catch {}
    }
    setNotifications([])
  }

  const approveApplication = async (n: UiNotification) => {
    try {
      setActingId(n.id)
      const data: any = (n.raw as any).data
      const ideaId = Number(data?.ideaId)
      const applicationId = Number(data?.applicationId)
      if (!ideaId || !applicationId) {
        throw new Error('通知データに必要な情報がありません')
      }
      await ideasApi.apiIdeasIdApplicationsApplicationIdPut(ideaId, applicationId, { action: 'approve' })
      await notificationsApi.apiNotificationsIdReadPut(n.id)
      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, isRead: true } : item))
    } catch (e: any) {
      console.error(e)
      setError(e?.message || '承認に失敗しました')
    } finally {
      setActingId(null)
    }
  }

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
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <p>読み込み中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
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
                     {!notification.isRead && notification.type === 'application' && (
                       <button
                         onClick={() => approveApplication(notification)}
                         disabled={actingId === notification.id}
                         className={`text-sm ${actingId === notification.id ? 'text-gray-400' : 'text-green-600 hover:text-green-800'}`}
                       >
                         {actingId === notification.id ? '処理中…' : '許可'}
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