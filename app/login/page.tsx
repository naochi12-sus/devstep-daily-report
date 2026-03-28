import React from "react";
export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            {/* ロゴ・タイトルエリア */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-indigo-900 mb-2">
                    Team Activity Log
                </h1>
                <p className="text-slate-600">
                    チームの成長を加速させる日報システム
                </p>
            </div>

            {/* ログインカード */}
            <div className="w-full max-w-112.5 bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    ログイン
                </h2>
                <p className="text-slate-500 text-sm mb-8">
                    アカウント情報を入力してダッシュボードへアクセスしてください。
                </p>

                <form className="space-y-6">
                    {/* メールアドレス入力 */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            メールアドレス
                        </label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* パスワード入力 */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-slate-700">
                                パスワード
                            </label>
                            <a
                                href="/reset-password"
                                className="text-sm text-emerald-600 hover:underline"
                            >
                                パスワードをお忘れですか？
                            </a>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* ログインボタン */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        ダッシュボードへログイン
                        <span>→</span>
                    </button>
                </form>
            </div>

            {/* 下部のリンク */}
            <p className="mt-8 text-slate-600">
                アカウントをお持ちでないですか？{" "}
                <a
                    href="/signup"
                    className="text-indigo-900 font-bold hover:underline"
                >
                    新規登録はこちら
                </a>
            </p>
        </div>
    );
}
