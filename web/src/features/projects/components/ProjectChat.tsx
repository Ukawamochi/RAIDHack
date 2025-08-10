import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../auth'
import { getProjectMessages, sendProjectMessage, type ChatMessage } from '../../../lib/projectApi'

interface ProjectChatProps {
  projectId: string
  isHost: boolean
}

function ProjectChat({ projectId, isHost }: ProjectChatProps) {
  const { username: paramUsername } = useParams<{ username?: string }>()
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // モックメッセージデータ（実際のAPIが実装されるまで）
  const mockMessages: ChatMessage[] = [
    {
      id: 1,
      userId: 1,
      userName: 'ユーザー2',
      message: 'プロジェクトの進捗はいかがですか？',
      timestamp: new Date().toISOString(),
      type: 'public'
    },
    {
      id: 2,
      userId: 2,
      userName: 'ユーザー3',
      message: 'UIの実装が完了しました！',
      timestamp: new Date().toISOString(),
      type: 'public'
    },
    {
      id: 3,
      userId: 3,
      userName: 'ユーザー4',
      message: 'APIの統合も順調に進んでいます',
      timestamp: new Date().toISOString(),
      type: 'public'
    },
    {
      id: 4,
      userId: 4,
      userName: 'ユーザー5',
      message: 'テストケースの作成も完了予定です',
      timestamp: new Date().toISOString(),
      type: 'public'
    }
  ]

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        // 実際のAPIが実装されるまでモックデータを使用
    if (paramUsername) {
          try {
      const messageData = await getProjectMessages(paramUsername, projectId, 'public')
            setMessages(messageData)
          } catch (error) {
            console.warn('API failed, using mock data:', error)
            setMessages(mockMessages)
          }
        } else {
          setMessages(mockMessages)
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error)
        setMessages(mockMessages)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [projectId, paramUsername])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return

    try {
      // 楽観的UIアップデート
      const newMsg: ChatMessage = {
        id: Date.now(),
        userId: user.id,
        userName: user.username,
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        type: 'public'
      }
      setMessages(prev => [...prev, newMsg])
      setNewMessage('')

      // 実際のAPI呼び出し（失敗してもUIは更新済み）
    if (paramUsername) {
        try {
      await sendProjectMessage(paramUsername, projectId, newMessage.trim(), 'public')
        } catch (error) {
          console.warn('Send message failed:', error)
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="h-screen flex flex-col">
      {/* チャットヘッダー */}
      <div className="p-6 border-b border-[#5A5D6A]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <h3 className="text-white font-medium">全体チャット</h3>
          </div>
        </div>
        
        {/* オンラインユーザー一覧 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            <span className="text-white text-sm font-medium">ユーザー1へ</span>
          </div>
          <div className="ml-8 space-y-1 text-white text-sm">
            <div>ユーザー2</div>
            <div>ユーザー3</div>
            <div>ユーザー4</div>
            <div>ユーザー5</div>
          </div>
        </div>
      </div>

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="text-gray-400">メッセージを読み込み中...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center p-4">
            <div className="text-gray-400">まだメッセージがありません</div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex space-x-3">
                {/* アバター */}
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">{msg.userName.charAt(0)}</span>
                </div>
                
                {/* メッセージ内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-white">{msg.userName}</span>
                    <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed break-words">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* メッセージ入力 */}
      <div className="p-4 border-t border-[#5A5D6A]">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="メッセージを入力..."
            className="flex-1 px-4 py-3 bg-[#5A5D6A] border border-[#6A6D7A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectChat