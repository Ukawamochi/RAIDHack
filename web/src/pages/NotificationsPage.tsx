import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  Bell,
  CheckCircle,
  Check,
  Users,
  Lightbulb,
  Trophy,
  Settings,
  Trash2
} from 'lucide-react';

interface NotificationData {
  ideaId?: number;
  teamId?: number;
  workId?: number;
  [key: string]: unknown;
}

interface Notification {
  id: number;
  type: 'application' | 'team_invite' | 'application_status' | 'new_idea' | 'vote' | 'system';
  title: string;
  message: string;
  data?: NotificationData;
  is_read: boolean;
  created_at: string;
}

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('通知の取得に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error('通知の既読処理に失敗しました:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );
    } catch (error) {
      console.error('一括既読処理に失敗しました:', error);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error('通知の削除に失敗しました:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'application':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'team_invite':
        return <Users className="w-5 h-5 text-green-500" />;
      case 'application_status':
        return <CheckCircle className="w-5 h-5 text-purple-500" />;
      case 'new_idea':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'vote':
        return <Trophy className="w-5 h-5 text-orange-500" />;
      case 'system':
        return <Settings className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // 通知の種類に応じて適切なページに遷移
    if (notification.data) {
      const data = notification.data;
      
      if (notification.type === 'application' && data.ideaId) {
        navigate(`/ideas/${data.ideaId}`);
      } else if (notification.type === 'team_invite' && data.teamId) {
        navigate('/teams');
      } else if (notification.type === 'application_status' && data.ideaId) {
        navigate(`/ideas/${data.ideaId}`);
      } else if (notification.type === 'new_idea' && data.ideaId) {
        navigate(`/ideas/${data.ideaId}`);
      } else if (notification.type === 'vote' && data.workId) {
        navigate('/works');
      }
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') {
      return !notification.is_read;
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">通知</h1>
                <p className="text-gray-600 mt-1">
                  {unreadCount > 0 ? `${unreadCount}件の未読通知があります` : '未読通知はありません'}
                </p>
              </div>
            </div>
            
            {/* アクションボタン */}
            <div className="flex items-center space-x-4">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50"
                >
                  <Check className="w-4 h-4 mr-2" />
                  すべて既読にする
                </button>
              )}
            </div>
          </div>

          {/* フィルター */}
          <div className="mt-6 flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-xs">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              すべて ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === 'unread'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              未読 ({unreadCount})
            </button>
          </div>
        </div>

        {/* 通知リスト */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' ? '未読通知はありません' : '通知はありません'}
              </h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? 'すべての通知を既読にしました。' 
                  : '新しい通知が届くとここに表示されます。'
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md cursor-pointer ${
                  !notification.is_read ? 'border-l-4 border-l-indigo-500 bg-indigo-50/30' : 'border-gray-200'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`text-sm font-medium ${
                            !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: ja
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* アクションメニュー */}
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.is_read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="p-1 text-gray-400 hover:text-indigo-600 rounded"
                          title="既読にする"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );
};
