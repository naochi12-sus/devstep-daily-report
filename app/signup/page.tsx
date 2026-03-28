import Link from "next/link";

export default function SignupPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 font-sans p-4">
            {/* アプリ名とサブタイトル */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-[#1e3a8a] tracking-tight">
                    Team Activity Log
                </h1>
                <p className="mt-3 text-sm font-medium text-slate-600">
                    チームの成長を加速させる日報システム
                </p>
            </div>

            {/* カード全体のコンテナ */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
                <div className="p-8 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            新規登録
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                            必要な情報を入力して、新しいアカウントを作成してください。
                        </p>
                    </div>

                    <form className="space-y-5">
                        {/* お名前（新規登録用に追加） */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                お名前
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#34d399] focus:border-transparent transition-all text-sm"
                                placeholder="山田 太郎"
                            />
                        </div>

                        {/* メールアドレス */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#34d399] focus:border-transparent transition-all text-sm"
                                placeholder="name@example.com"
                            />
                        </div>

                        {/* パスワード */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                パスワード
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#34d399] focus:border-transparent transition-all text-sm"
                                placeholder="8文字以上で入力"
                            />
                        </div>

                        {/* 登録ボタン */}
                        <button
                            type="button"
                            className="w-full py-3 px-4 bg-[#20c997] hover:bg-[#1ba87e] text-white font-bold rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2 mt-4"
                        >
                            アカウントを作成する
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* フッターエリア（ログイン画面への誘導） */}
                <div className="bg-[#f0fdfa] border-t border-teal-100 p-5 text-center">
                    <p className="text-sm text-slate-500">
                        すでにアカウントをお持ちですか？{" "}
                        <Link
                            href="/login"
                            className="font-bold text-[#1e3a8a] hover:underline"
                        >
                            ログインはこちら
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
