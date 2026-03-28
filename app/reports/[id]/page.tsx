export default function ReportDetailScreen() {
    // プレビュー用のDiceBearアバター画像URL
    const authorAvatar = `https://api.dicebear.com/7.x/shapes/svg?seed=Yamada&backgroundColor=0a5b83,1c799f,69d2e7,f1f4dc,f88c49`;
    const commenterAvatar = `https://api.dicebear.com/7.x/shapes/svg?seed=Sato&backgroundColor=0a5b83,1c799f,69d2e7,f1f4dc,f88c49`;

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900">
            {/* 共通ヘッダー */}
            <header className="bg-[#1e3a8a] text-white shadow-md sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-xl font-bold tracking-wider cursor-pointer">
                        DevStep Daily
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <span className="text-sm font-medium">
                            {"山田 太郎 ▼"}
                        </span>
                        <div className="h-9 w-9 rounded-full bg-white overflow-hidden shadow-inner border border-slate-200">
                            <img
                                src={authorAvatar}
                                alt="My Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* メインコンテンツ（読みやすさ重視のmax-w-3xl） */}
            <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
                {/* 戻るボタン */}
                <div className="flex items-center gap-3">
                    <button className="text-slate-500 hover:text-[#2dd4bf] transition-colors flex items-center gap-1.5 text-sm font-bold">
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
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        ダッシュボードに戻る
                    </button>
                </div>

                {/* --- 日報本文カード --- */}
                <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* 記事ヘッダー（投稿者情報とタイトル） */}
                    <div className="p-8 pb-6 border-b border-slate-100 bg-[#ecfeff]/30">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-4">
                                {/* 投稿者のアバター */}
                                <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-200 bg-white shadow-sm">
                                    <img
                                        src={authorAvatar}
                                        alt="Author"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="font-bold text-slate-800 text-lg">
                                            山田 太郎
                                        </h2>
                                        <span className="bg-[#2dd4bf] text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-wide">
                                            開発
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect
                                                x="3"
                                                y="4"
                                                width="18"
                                                height="18"
                                                rx="2"
                                                ry="2"
                                            ></rect>
                                            <line
                                                x1="16"
                                                y1="2"
                                                x2="16"
                                                y2="6"
                                            ></line>
                                            <line
                                                x1="8"
                                                y1="2"
                                                x2="8"
                                                y2="6"
                                            ></line>
                                            <line
                                                x1="3"
                                                y1="10"
                                                x2="21"
                                                y2="10"
                                            ></line>
                                        </svg>
                                        2024.05.24 18:30
                                    </div>
                                </div>
                            </div>

                            {/* 編集・削除ボタン（自分が投稿者の場合のみ表示される想定） */}
                            <div className="flex gap-2">
                                <button
                                    className="p-2 text-slate-400 hover:text-[#2dd4bf] transition-colors rounded-md hover:bg-slate-50"
                                    title="編集する"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                            本日の開発進捗と来週の予定
                        </h1>
                    </div>

                    {/* 記事本文 */}
                    <div className="p-8 text-slate-700 leading-loose">
                        <p className="whitespace-pre-wrap">
                            {`お疲れ様です。山田です。

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
                        </p>
                    </div>
                </article>

                {/* --- コメントセクション --- */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* コメントヘッダー */}
                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            コメント <span className="text-[#2dd4bf]">1件</span>
                        </h3>
                    </div>

                    {/* コメントリスト（既存のコメント） */}
                    <div className="p-6 space-y-6">
                        <div className="flex gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden border border-slate-200 bg-white shadow-sm mt-1">
                                <img
                                    src={commenterAvatar}
                                    alt="Commenter"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* 吹き出し風のデザイン */}
                            <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-none p-4 border border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm text-slate-800">
                                        佐藤 花子
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">
                                        2024.05.24 19:15
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {`お疲れ様です！APIの実装、予定通り完了して素晴らしいですね。
来週のUI仕上げもよろしくお願いします。良い週末を！`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* コメント入力フォーム */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                        <div className="flex gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden border border-slate-200 bg-white shadow-sm">
                                <img
                                    src={authorAvatar}
                                    alt="Me"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 space-y-3">
                                <textarea
                                    placeholder="山田さんにコメントを送信..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-[#2dd4bf] focus:ring-2 focus:ring-[#2dd4bf]/20 transition-all resize-none shadow-sm"
                                ></textarea>
                                <div className="flex justify-end">
                                    <button className="px-5 py-2.5 rounded-lg font-bold text-white bg-[#2dd4bf] hover:bg-[#25b5a3] shadow-sm transition-colors text-sm flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line
                                                x1="22"
                                                x2="11"
                                                y1="2"
                                                y2="13"
                                            />
                                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                        送信
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
