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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // フォームの送信によるリロードを防ぐ
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert("ログイン失敗: " + error.message);
        } else {
            router.push("/reports"); // ログイン成功後日報一覧ページへ
        }
        setLoading(false);
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

            {/* ログインカード */}
            <div className="w-full max-w-112.5 bg-white rounded-2xl shadow-xl p-8">
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">
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
                            <label className="text-sm font-medium text-slate-700">
                                パスワード
                            </label>
                            <Link
                                href="/reset-password"
                                className="text-sm text-emerald-600 hover:underline"
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
                        className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 cursor-pointer "
                    >
                        {loading ? "ログイン中..." : "ダッシュボードへログイン"}
                        {!loading && <span>→</span>}
                    </button>
                </form>
            </div>

            {/* 下部のリンク */}
            <p className="mt-8 text-slate-600">
                アカウントをお持ちでないですか？{" "}
                <Link
                    href="/signup"
                    className="text-indigo-900 font-bold hover:underline"
                >
                    新規登録はこちら
                </Link>
            </p>
        </div>
    );
}
