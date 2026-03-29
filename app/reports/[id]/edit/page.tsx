export default function EditReportScreen() {
    // プレビュー用アバター（DiceBear API）
    const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=Yamada&backgroundColor=0a5b83,1c799f,69d2e7,f1f4dc,f88c49`;

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900">
            {/* 共通ヘッダー */}
            <header className="bg-[#1e3a8a] text-white shadow-md sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-xl font-bold tracking-wider cursor-pointer">
                        Team Activity Log
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <span className="text-sm font-medium">
                            {"山田 太郎 ▼"}
                        </span>
                        <div className="h-9 w-9 rounded-full bg-white text-[#1e3a8a] overflow-hidden shadow-inner border border-slate-200">
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-3xl mx-auto px-6 py-10">
                {/* タイトルと削除ボタンの行 */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button className="text-slate-400 hover:text-[#2dd4bf] transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                            日報の編集
                        </h1>
                    </div>

                    {/* 削除ボタン（右上にさりげなく、かつ赤色で警告を意味するデザイン） */}
                    <button className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                        日報を削除
                    </button>
                </div>

                {/* フォームカード */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <form className="p-8 space-y-6">
                        {/* 2カラムレイアウト（日付とカテゴリ） */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 日付選択（defaultValueで既存データが入っている状態を表現） */}
                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-bold text-slate-700"
                                    htmlFor="date"
                                >
                                    日付 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    defaultValue="2024-05-24"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-[#2dd4bf] focus:ring-2 focus:ring-[#2dd4bf]/20 transition-all"
                                />
                            </div>

                            {/* カテゴリ選択 */}
                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-bold text-slate-700"
                                    htmlFor="category"
                                >
                                    カテゴリ{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    defaultValue="dev"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-[#2dd4bf] focus:ring-2 focus:ring-[#2dd4bf]/20 transition-all"
                                >
                                    <option value="dev">開発</option>
                                    <option value="meeting">会議</option>
                                    <option value="sales">営業</option>
                                    <option value="other">その他</option>
                                </select>
                            </div>
                        </div>

                        {/* タイトル入力 */}
                        <div className="space-y-2">
                            <label
                                className="block text-sm font-bold text-slate-700"
                                htmlFor="title"
                            >
                                タイトル <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                defaultValue="本日の開発進捗と来週の予定"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-[#2dd4bf] focus:ring-2 focus:ring-[#2dd4bf]/20 transition-all"
                            />
                        </div>

                        {/* 本文入力（長文がすでに入っている状態） */}
                        <div className="space-y-2">
                            <label
                                className="block text-sm font-bold text-slate-700"
                                htmlFor="content"
                            >
                                業務内容・所感{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="content"
                                rows={12}
                                defaultValue={`お疲れ様です。山田です。

1. 本日の業務内容
・〇〇機能のAPI実装（完了）
・フロントエンドとの連携テスト（完了）

2. 発生した課題
・特になし。APIのレスポンス速度も想定通り基準値を満たしています。

3. 明日の予定
・UIの仕上げ（Tailwind CSSの調整）
・PRの作成とコードレビュー依頼

4. 所感
今週は順調にタスクを消化できました。来週のリリースに向けて、週末は少しリフレッシュして月曜日に備えたいと思います。`}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:border-[#2dd4bf] focus:ring-2 focus:ring-[#2dd4bf]/20 transition-all resize-y"
                            ></textarea>
                        </div>

                        {/* アクションボタン（フッターエリア） */}
                        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                type="button"
                                className="px-6 py-3 rounded-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                            >
                                キャンセル
                            </button>

                            {/* ボタンの文言とアイコンを「保存」に合わせて変更 */}
                            <button
                                type="button"
                                className="px-8 py-3 rounded-lg font-bold text-white bg-[#2dd4bf] hover:bg-[#25b5a3] shadow-sm transition-colors flex items-center gap-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                    <polyline points="17 21 17 13 7 13 7 21" />
                                    <polyline points="7 3 7 8 15 8" />
                                </svg>
                                変更を保存する
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
