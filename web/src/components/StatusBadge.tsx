import React from 'react'

type Status = 'open' | 'development' | 'completed'

interface StatusBadgeProps {
  status: Status
  className?: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = (status: Status) => {
    switch (status) {
      case 'open':
        return {
          text: '募集中',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          icon: '🔍'
        }
      case 'development':
        return {
          text: '進行中',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          icon: '⚡'
        }
      case 'completed':
        return {
          text: 'Done',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: '✅'
        }
      default:
        return {
          text: '不明',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: '❓'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.text}
    </span>
  )
}

export default StatusBadge