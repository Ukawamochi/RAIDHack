import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Lightbulb, 
  UserCheck, 
  Trophy, 
  MessageSquare, 
  TrendingUp,
  Settings,
  AlertCircle,
  PieChart,
  Activity
} from 'lucide-react';

interface AdminStats {
  users: number;
  ideas: number;
  teams: number;
  works: number;
  applications: number;
  votes: number;
}

interface RecentIdea {
  id: number;
  title: string;
  username: string;
  status: string;
}

interface RecentApplication {
  id: number;
  title: string;
  username: string;
  status: string;
}

interface RecentWork {
  id: number;
  title: string;
  team_name: string;
  status: string;
}

interface RecentActivity {
  ideas: RecentIdea[];
  applications: RecentApplication[];
  works: RecentWork[];
}

interface StatusStats {
  ideas: { status: string; count: number }[];
  applications: { status: string; count: number }[];
  teams: { status: string; count: number }[];
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
  const [statusStats, setStatusStats] = useState<StatusStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
        setStatusStats(data.statusStats);
      } else if (response.status === 403) {
        setError('管理者権限が必要です');
      } else {
        setError('統計の取得に失敗しました');
      }
    } catch (error) {
      console.error('管理者統計取得エラー:', error);
      setError('統計の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'open':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'active':
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'disbanded':
        return 'bg-red-100 text-red-800';
      case 'development':
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      open: '募集中',
      development: '開発中',
      completed: '完了',
      pending: '保留中',
      approved: '承認済み',
      rejected: '却下',
      active: 'アクティブ',
      disbanded: '解散',
      submitted: '提出済み'
    };
    return statusMap[status] || status;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">アクセスエラー</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center">
            <Settings className="w-8 h-8 text-indigo-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>
              <p className="text-gray-600 mt-1">システム全体の統計と管理</p>
            </div>
          </div>
        </div>

        {/* 基本統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ユーザー</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.users || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Lightbulb className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">アイデア</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.ideas || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">チーム</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.teams || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">作品</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.works || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">応募</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.applications || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">投票数</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.votes || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* ステータス統計 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <PieChart className="w-5 h-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">ステータス別統計</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* アイデアステータス */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">アイデア</h3>
                  <div className="space-y-2">
                    {statusStats?.ideas.map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 応募ステータス */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">応募</h3>
                  <div className="space-y-2">
                    {statusStats?.applications.map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* チームステータス */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">チーム</h3>
                  <div className="space-y-2">
                    {statusStats?.teams.map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 最近の活動 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">最近の活動</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* 最新アイデア */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">最新アイデア</h3>
                  <div className="space-y-2">
                    {recentActivity?.ideas.slice(0, 3).map((idea) => (
                      <div key={idea.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{idea.title}</p>
                          <p className="text-xs text-gray-500">by {idea.username}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(idea.status)}`}>
                          {getStatusText(idea.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 最新応募 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">最新応募</h3>
                  <div className="space-y-2">
                    {recentActivity?.applications.slice(0, 3).map((app) => (
                      <div key={app.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{app.title}</p>
                          <p className="text-xs text-gray-500">by {app.username}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(app.status)}`}>
                          {getStatusText(app.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 最新作品 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">最新作品</h3>
                  <div className="space-y-2">
                    {recentActivity?.works.slice(0, 3).map((work) => (
                      <div key={work.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{work.title}</p>
                          <p className="text-xs text-gray-500">by {work.team_name}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(work.status)}`}>
                          {getStatusText(work.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* クイックアクション */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">クイックアクション</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">ユーザー管理</p>
              </button>

              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Lightbulb className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">アイデア管理</p>
              </button>

              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <UserCheck className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">チーム管理</p>
              </button>

              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageSquare className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">システム通知</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
