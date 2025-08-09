import { useState, useEffect } from 'react'
import { useAlert } from '../../notifications'

const NewProjectForm = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [isRecruitingMembers, setIsRecruitingMembers] = useState(true)
  const { showSuccess, showError } = useAlert()

  // ページ読み込み時に下書きを復元
  useEffect(() => {
    const savedDraft = localStorage.getItem('projectDraft')
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft)
        setTitle(draftData.title || '')
        setDescription(draftData.description || '')
        setTags(draftData.tags || '')
        setIsRecruitingMembers(draftData.isRecruitingMembers ?? true)
        console.log('下書きを復元しました')
      } catch (error) {
        console.error('下書きの復元に失敗しました:', error)
      }
    }
  }, [])

  // 自動保存機能（入力から3秒後に自動保存）
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || description || tags) {
        const draftData = { title, description, tags, isRecruitingMembers, savedAt: new Date().toISOString() }
        try {
          localStorage.setItem('projectDraft', JSON.stringify(draftData))
          console.log('自動保存しました')
        } catch (error) {
          console.error('自動保存に失敗しました:', error)
        }
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [title, description, tags, isRecruitingMembers])

  const handleSaveDraft = () => {
    const draftData = { title, description, tags, isRecruitingMembers, savedAt: new Date().toISOString() }
    try {
      localStorage.setItem('projectDraft', JSON.stringify(draftData))
      showSuccess('下書きを保存しました', '入力内容が保存されました')
      console.log('下書きに保存しました', draftData)
    } catch (error) {
      showError('保存に失敗しました', '下書きの保存中にエラーが発生しました')
      console.error('下書きの保存に失敗しました:', error)
    }
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      showError('入力エラー', 'プロジェクトタイトルを入力してください')
      return
    }
    
    console.log('投稿', { title, description, tags, isRecruitingMembers })
    
    // 投稿完了後は下書きを削除
    try {
      localStorage.removeItem('projectDraft')
      showSuccess('投稿しました', 'プロジェクトが正常に投稿されました')
      console.log('下書きを削除しました')
    } catch (error) {
      showError('エラー', '投稿は成功しましたが、下書きの削除に失敗しました')
      console.error('下書きの削除に失敗しました:', error)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#464A5F' }}>
      <div className="flex">
        {/* メインコンテンツ */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-medium text-white mb-8">プロジェクトを投稿</h1>
          
          <div className="max-w-4xl">
            {/* タイトル入力 */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="プロジェクトタイトルを入力"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 bg-transparent border-2 border-gray-400 rounded-lg text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors duration-200"
              />
            </div>

            {/* 詳細・ドキュメント入力 */}
            <div className="mb-6">
              <textarea
                placeholder="詳細・ドキュメントを入力"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={12}
                className="w-full p-4 bg-transparent border-2 border-gray-400 rounded-lg text-white placeholder-gray-400 focus:border-white focus:outline-none resize-none transition-colors duration-200"
              />
            </div>

            {/* タグ入力 */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="タグを追加（任意）"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-4 bg-transparent border-2 border-gray-400 rounded-lg text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="w-80 p-8">
          <div className="space-y-6">
            {/* 参加者募集トグル */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">参加者を募集</span>
                <button
                  onClick={() => setIsRecruitingMembers(!isRecruitingMembers)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                    ${isRecruitingMembers ? 'bg-green-500' : 'bg-gray-400'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                      ${isRecruitingMembers ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="space-y-3">
              <button
                onClick={handleSaveDraft}
                className="w-full py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
              >
                下書きに保存
              </button>
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                投稿
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewProjectForm