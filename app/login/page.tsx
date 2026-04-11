"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // ローディング状態を追加
    const router = useRouter();

    const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. ログイン実行
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            // 2. もし認証エラー（パスワード違いなど）があれば catch へ飛ばす
            if (error) throw error;

            // 3. 成功したらダッシュボードへ
            router.push("/reports");
        } catch (error) {
            // 4. ここですべてのエラーを安全に処理
            console.error("ログインエラー:", error);

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "予期せぬエラーが発生しました";

            alert("ログインに失敗しました: " + errorMessage);
        } finally {
            // 5. 成功・失敗に関わらず、最後は必ずボタンのローディングを解除
            setLoading(false);
        }
    };

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

            {/* カード全体のコンテナ */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        ログイン
                    </h2>
                    <p className="text-slate-500 text-sm mb-8">
                        アカウント情報を入力してダッシュボードへアクセスしてください。
                    </p>

                    {/* メールアドレス入力 */}
                    {/* formに onSubmit を追加 */}
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                required
                                value={email} // Stateを紐付け
                                onChange={(e) => setEmail(e.target.value)} // 入力時にStateを更新
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* パスワード入力 */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-sm font-medium text-slate-700 mb-2">
                                    パスワード
                                </label>
                                <Link
                                    href="/reset-password"
                                    className="text-sm text-teal-600 hover:text-teal-700 hover:underline"
                                >
                                    パスワードをお忘れですか？
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                value={password} // Stateを紐付け
                                onChange={(e) => setPassword(e.target.value)} // 入力時にStateを更新
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* ログインボタン */}
                        <button
                            type="submit"
                            disabled={loading} // 処理中はボタンを無効化
                            className="w-full bg-[#2dd4bf] hover:bg-[#25b5a3] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 cursor-pointer "
                        >
                            {loading
                                ? "ログイン中..."
                                : "ダッシュボードへログイン"}
                            {!loading && <span>→</span>}
                        </button>
                    </form>
                </div>

                {/* フッターエリア（新規登録画面への誘導） */}
                <div className="bg-[#f0fdfa] border-t border-teal-100 p-5 text-center">
                    <p className="text-sm text-slate-500">
                        アカウントをお持ちでないですか？ <br />
                        <Link
                            href="/signup"
                            className="block mt-1 font-bold text-[#1e3a8a] hover:underline mb-2"
                        >
                            新規登録はこちら
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
