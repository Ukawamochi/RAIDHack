-- =============================================
-- 不要なテーブルのクリーンアップ
-- 旧設計・未使用テーブルの削除
-- =============================================

-- 旧設計のテーブルを削除
DROP TABLE IF EXISTS work_team_members;  -- 現在はteam_membersテーブルを使用
DROP TABLE IF EXISTS work_votes;         -- 現在はvotesテーブルを使用

-- 確認用: 残っているテーブル一覧を表示
-- SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;

-- 注意: sqlite_sequenceテーブルは削除しないでください
-- これはSQLiteが AUTOINCREMENT のために自動生成するシステムテーブルです
-- 削除すると AUTO_INCREMENT が正常に動作しなくなります

-- 現在の正式なテーブル一覧:
-- 1. users - ユーザー情報
-- 2. ideas - アイデア投稿
-- 3. applications - アイデアへの応募
-- 4. teams - チーム情報
-- 5. team_members - チームメンバー
-- 6. works - 作品投稿
-- 7. votes - 作品への投票
-- 8. idea_likes - アイデアへのいいね
-- 9. notifications - 通知システム
-- システムテーブル:
-- - sqlite_sequence (SQLite自動生成、削除禁止)
-- - _cf_METADATA (Cloudflare自動生成、削除禁止)
