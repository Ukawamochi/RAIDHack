import { useNotifications } from '../contexts/NotificationContext'

// 便利な通知関数を提供するカスタムフック
export const useAlert = () => {
  const { addNotification } = useNotifications()

  const showSuccess = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'success', title, message, duration })
  }

  const showError = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'error', title, message, duration })
  }

  const showWarning = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'warning', title, message, duration })
  }

  const showInfo = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'info', title, message, duration })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

export { useNotifications } from '../contexts/NotificationContext'