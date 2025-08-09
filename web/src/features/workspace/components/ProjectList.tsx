import { useAuth } from '../../auth'
import { useNavigate, useLocation } from 'react-router-dom'
import ProjectItem from './ProjectItem'

const ProjectList = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // /newページでは非表示
  if (!isAuthenticated || location.pathname === '/new') {
    return null
  }

  // TODO: 実際のプロジェクトデータを取得
  const mockProjects = [
    {
      id: '1',
      title: 'ECサイト構築プロジェクト',
      username: '田中太郎',
      status: '実装中',
      memberCount: 2,
      tags: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      avatar: '',
      role: 'ホスト',
      members: [
        { id: '1', username: '田中太郎', avatarUrl: 'https://via.placeholder.com/32x32/4A90E2/FFFFFF?text=T' },
        { id: '2', username: '佐藤花子', avatarUrl: 'https://via.placeholder.com/32x32/7ED321/FFFFFF?text=S' }
      ]
    },
    {
      id: '2',
      title: 'SNSアプリケーション開発',
      username: '佐藤花子',
      status: '設計中',
      memberCount: 3,
      tags: ['Vue.js', 'Firebase', 'PWA'],
      avatar: '',
      role: 'Fork',
      members: [
        { id: '3', username: '佐藤花子', avatarUrl: 'https://via.placeholder.com/32x32/7ED321/FFFFFF?text=S' },
        { id: '4', username: '山田次郎', avatarUrl: 'https://via.placeholder.com/32x32/F5A623/FFFFFF?text=Y' },
        { id: '5', username: '鈴木三郎', avatarUrl: '' }
      ]
    },
    {
      id: '3',
      title: 'タスク管理ツール',
      username: '山田次郎',
      status: '実装中',
      memberCount: 4,
      tags: ['Angular', 'Express', 'PostgreSQL'],
      avatar: '',
      role: '参加',
      members: [
        { id: '6', username: '山田次郎', avatarUrl: 'https://via.placeholder.com/32x32/F5A623/FFFFFF?text=Y' },
        { id: '7', username: '高橋美咲', avatarUrl: 'https://via.placeholder.com/32x32/BD10E0/FFFFFF?text=T' },
        { id: '8', username: '伊藤健一', avatarUrl: '' },
        { id: '9', username: '渡辺由美', avatarUrl: 'https://via.placeholder.com/32x32/50E3C2/FFFFFF?text=W' }
      ]
    },
    {
      id: '4',
      title: 'ブログプラットフォーム',
      username: '鈴木三郎',
      status: 'テスト中',
      memberCount: 2,
      tags: ['Next.js', 'Prisma', 'Vercel'],
      avatar: '',
      role: 'ホスト',
      members: [
        { id: '10', username: '鈴木三郎', avatarUrl: 'https://via.placeholder.com/32x32/D0021B/FFFFFF?text=S' },
        { id: '11', username: '中村一郎', avatarUrl: '' }
      ]
    },
    {
      id: '5',
      title: 'レシピ共有アプリ',
      username: '高橋美咲',
      status: '実装中',
      memberCount: 5,
      tags: ['React Native', 'Expo', 'Supabase'],
      avatar: '',
      role: '参加',
      members: [
        { id: '12', username: '高橋美咲', avatarUrl: 'https://via.placeholder.com/32x32/BD10E0/FFFFFF?text=T' },
        { id: '13', username: '小林恵子', avatarUrl: 'https://via.placeholder.com/32x32/9013FE/FFFFFF?text=K' },
        { id: '14', username: '加藤直樹', avatarUrl: '' },
        { id: '15', username: '田中太郎', avatarUrl: 'https://via.placeholder.com/32x32/4A90E2/FFFFFF?text=T' },
        { id: '16', username: '佐藤花子', avatarUrl: 'https://via.placeholder.com/32x32/7ED321/FFFFFF?text=S' }
      ]
    },
    {
      id: '6',
      title: '在庫管理システム',
      username: '伊藤健一',
      status: 'リリース準備',
      memberCount: 3,
      tags: ['Django', 'Python', 'Docker'],
      avatar: '',
      role: 'Fork',
      members: [
        { id: '17', username: '伊藤健一', avatarUrl: '' },
        { id: '18', username: '渡辺由美', avatarUrl: 'https://via.placeholder.com/32x32/50E3C2/FFFFFF?text=W' },
        { id: '19', username: '中村一郎', avatarUrl: '' }
      ]
    },
    {
      id: '7',
      title: '音楽ストリーミングアプリ',
      username: '渡辺由美',
      status: '設計中',
      memberCount: 6,
      tags: ['Flutter', 'AWS', 'GraphQL'],
      avatar: '',
      role: 'ホスト',
      members: [
        { id: '20', username: '渡辺由美', avatarUrl: 'https://via.placeholder.com/32x32/50E3C2/FFFFFF?text=W' },
        { id: '21', username: '小林恵子', avatarUrl: 'https://via.placeholder.com/32x32/9013FE/FFFFFF?text=K' },
        { id: '22', username: '加藤直樹', avatarUrl: '' },
        { id: '23', username: '田中太郎', avatarUrl: 'https://via.placeholder.com/32x32/4A90E2/FFFFFF?text=T' },
        { id: '24', username: '山田次郎', avatarUrl: 'https://via.placeholder.com/32x32/F5A623/FFFFFF?text=Y' },
        { id: '25', username: '佐藤花子', avatarUrl: 'https://via.placeholder.com/32x32/7ED321/FFFFFF?text=S' }
      ]
    },
    {
      id: '8',
      title: '家計簿アプリケーション',
      username: '中村一郎',
      status: '実装中',
      memberCount: 2,
      tags: ['Svelte', 'SvelteKit', 'SQLite'],
      avatar: '',
      role: '参加',
      members: [
        { id: '26', username: '中村一郎', avatarUrl: '' },
        { id: '27', username: '鈴木三郎', avatarUrl: 'https://via.placeholder.com/32x32/D0021B/FFFFFF?text=S' }
      ]
    },
    {
      id: '9',
      title: 'オンライン学習プラットフォーム',
      username: '小林恵子',
      status: '実装中',
      memberCount: 8,
      tags: ['Laravel', 'Vue.js', 'MySQL'],
      avatar: '',
      role: 'ホスト',
      members: [
        { id: '28', username: '小林恵子', avatarUrl: 'https://via.placeholder.com/32x32/9013FE/FFFFFF?text=K' },
        { id: '29', username: '加藤直樹', avatarUrl: '' },
        { id: '30', username: '田中太郎', avatarUrl: 'https://via.placeholder.com/32x32/4A90E2/FFFFFF?text=T' },
        { id: '31', username: '佐藤花子', avatarUrl: 'https://via.placeholder.com/32x32/7ED321/FFFFFF?text=S' },
        { id: '32', username: '山田次郎', avatarUrl: 'https://via.placeholder.com/32x32/F5A623/FFFFFF?text=Y' },
        { id: '33', username: '高橋美咲', avatarUrl: 'https://via.placeholder.com/32x32/BD10E0/FFFFFF?text=T' },
        { id: '34', username: '伊藤健一', avatarUrl: '' },
        { id: '35', username: '渡辺由美', avatarUrl: 'https://via.placeholder.com/32x32/50E3C2/FFFFFF?text=W' }
      ]
    },
    {
      id: '10',
      title: 'IoTデータ可視化ツール',
      username: '加藤直樹',
      status: 'プロトタイプ',
      memberCount: 4,
      tags: ['D3.js', 'WebSocket', 'InfluxDB'],
      avatar: '',
      role: '参加',
      members: [
        { id: '36', username: '加藤直樹', avatarUrl: '' },
        { id: '37', username: '中村一郎', avatarUrl: '' },
        { id: '38', username: '鈴木三郎', avatarUrl: 'https://via.placeholder.com/32x32/D0021B/FFFFFF?text=S' },
        { id: '39', username: '小林恵子', avatarUrl: 'https://via.placeholder.com/32x32/9013FE/FFFFFF?text=K' }
      ]
    }
  ]

  return (
    <div className="fixed left-20 top-0 w-80 h-full bg-white border-r border-gray-200 flex flex-col" style={{ minHeight: '100vh' }}>
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-medium text-gray-900">進行中のプロジェクト</h2>
      </div>

      {/* プロジェクト一覧 */}
      <div className="flex-1 overflow-y-auto">
        {mockProjects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>

      {/* 投稿ボタン */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={() => navigate('/new')}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors duration-200 flex items-center justify-center"
        >
          <span className="text-2xl mr-2">+</span>
          投稿
        </button>
      </div>
    </div>
  )
}

export default ProjectList