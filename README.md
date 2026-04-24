# チーム日報管理システム

- Team Activity Log (アプリケーション名)

## 概要

- 企業・チームで使用する日報管理システム。メンバーが日々の業務内容を記録し、チーム内で共有・コメントし合うことで、業務の可視化とコミュニケーションの活性化を図るアプリケーションです。
  シンプルなUIを採用し、エンジニアやビジネスチームが毎日の入力にストレスを感じない「実用性」と「読みやすさ」にこだわって開発しています。

## ターゲット層・解決する課題

###ターゲットユーザー

- 中小企業のチームリーダー・マネージャー
- リモートワークチームのメンバー

### 解決する課題

- 日報を紙やExcelでの管理からWebでの一元管理へ移行する。
- 現在、個人で管理しているタスクをチーム内で可視化・共有し、業務の属人化を防ぐ。
- 初対面、ネットワーク越しのメンバー同士でもコミュニケーションの活性化を図る。
- 日報へのフィードバックが遅い課題を、コメント機能で迅速化する。

## 使用技術（Tech Stack）

### 1. フロントエンド

- Next.js 16 (App Router)
- TypeScript厳格化（バグを防ぐための厳格な型定義）
- Tailwind CSS + shadcn/ui
- PC・スマホで表示可能（レスポンシブ設計）
- 直感的に操作できるUI設計

### 2. バックエンド

- Supabase（データの保存）
- PostgreSQL（Supabaseの裏側で動いているデータベース）
- Supabase Auth（認証）
- RLS (Row Level Security)
    - `daily_reports`：全員が全件閲覧可能・自分の日報のみ作成・編集・削除可能
    - `comments`：全員が全件閲覧可能・自分のコメントのみ作成・削除可能

### 3. インフラ・CI/CD

- Vercel（ホスティング環境）
- GitHub（バージョン管理）
- GitHub Actions（CI/CD設定）カバレッジ74.6%

### 4. テストコード

- Vitest (Unit Test)
- Playwright (E2E Test)

### 5. その他

- DiceBear API (アバター自動生成)
- バリデーション
- Mermaid Live Editor

## 主な機能（Features）

- **認証システム**:
    - メールアドレス / パスワードによるサインアップ・ログイン
    - パスワードリセット・再設定機能
- **活動記録（日報）管理機能**:
    - 日報の作成
    - 日報の編集（自分が作成した日報のみ編集可能）
    - 日報の削除（自分が作成した日報のみ削除可能）
    - カテゴリ選択（開発、会議、営業、その他で色分け可能）
    - 日報一覧表示（ページネーション対応）
    - 日報のユーザー絞り込み機能
    - 日報のカテゴリ絞り込み機能
    - 日報の日付絞り込み機能（今日、昨日のみ）
    -
- **コミュニケーション機能**:
    - 日報へのコメント投稿機能
    - コメントの削除（自分が作成したコメントのみ削除可能）
- **ユーザー管理**:
    - プロフィール編集（ユーザー名の変更）
    - 名前からの一意なアバター画像自動生成
      _(※) 画像アップロード機能を省き、外部API（DiceBear）によるSVG画像の自動生成を採用。_

## データベース設計（ER図）

![ER図](docs/er-diagram.png)

## 画面設計（画面遷移図）

![画面遷移図](docs/wireframes.png)

### 6. デモURL

### 7. 主要画面スクリーンショット

TOP画面(docs/images/TAL-Top.png)
ログイン画面(docs/images/TAL-login.png)
新規登録画面(docs/images/TAL-signup.png)
リセットパスワード画面(docs/images/TAL-reset-password.png)
マイ・ダッシュボード画面(docs/images/TAL-dashboard1.png)(docs/images/TAL-dashboard2.png)
日報作成画面(docs/images/TAL-create-report.png)
日報詳細画面(docs/images/TAL-report-detail.png)
プロフィール編集画面(docs/images/TAL-edit-profile.png)

### 8. セットアップ手順

プロジェクトのローカル開発環境を構築するための手順です。

## 1. 必要環境

- **Node.js**: 20.0.0 以上
- **パッケージマネージャー**: npm または yarn

## 2. インストール

リポジトリをクローンし、依存パッケージをインストールします。

```bash
# リポジトリをクローン
git clone [https://github.com/naochi12-sus/devstep-daily-report](https://github.com/naochi12-sus/devstep-daily-report)
cd devstep-daily-report

# 依存パッケージをインストール
npm install
```

## 3. 環境変数の設定

プロジェクト直下に .env.local ファイルを作成し、Supabaseの必要な値を設定する。
[!NOTE]
Supabase プロジェクトの作成方法は Supabase 公式ドキュメント （https://supabase.com/doc）を参照してください。

NEXT_PUBLIC_SUPABASE_URL Supabase プロジェクトの URL
NEXT_PUBLIC_SUPABASE_ANON_KEY Supabase の公開 anon キー

## 4. 開発サーバーの起動

サーバーを起動し、ブラウザで動作確認を行う。
npm run dev

起動後、 http://localhost:3000 を開く。

## 5. テスト実行方法

テスト種別 コマンド 備考
ユニットテスト npm run test Vitest を使用
ユニットテスト（Watch） npm run test:watch ファイル変更時に自動実行
カバレッジ計測 npm run test:coverage テスト網羅率を確認
E2Eテスト npm run test:e2e 実行前に npm run dev が必要

## 6. デプロイ方法

本プロジェクトはVercelへのデプロイを想定。
1.Vercel にログインし、本リポジトリを連携。
2.Vercel の設定画面で環境変数（　NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY　）を登録。
3.main ブランチへのマージにより、自動的に本番環境へデプロイされる。
