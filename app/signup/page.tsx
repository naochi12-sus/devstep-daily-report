"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault(); // リロード防止
        setLoading(true);

        try {
            // 1. Supabaseの新規登録機能を使う
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    // お名前をメタデータとして保存
                    data: {
                        full_name: name,
                    },
                },
            });

            // 2. エラーがあれば catch ブロックへ投げる
            if (error) throw error;

            // 3. 成功時
            alert("登録が完了しました！ログイン画面へ移動します。");
            router.push("/login");
        } catch (error) {
            // 4. ここですべてのエラーをキャッチ
            console.error("登録エラー:", error);

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "登録中に予期せぬエラーが発生しました";

            alert("登録に失敗しました: " + errorMessage);
        } finally {
            // 5. 最後に必ずローディングを解除する
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
                <div className="p-8 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            新規登録
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                            必要な情報を入力して、新しいアカウントを作成してください。
                        </p>
                    </div>

                    {/* お名前（新規登録用に追加） */}
                    {/* formにonSubmitを追加 */}
                    <form className="space-y-5" onSubmit={handleSignUp}>
                        {/* お名前 */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                お名前
                            </label>
                            <input
                                type="text"
                                required
                                value={name} // 追加
                                onChange={(e) => setName(e.target.value)} // 追加
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#34d399] transition-all text-sm"
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
                                required
                                value={email} // 追加
                                onChange={(e) => setEmail(e.target.value)} // 追加
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#34d399] transition-all text-sm"
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
                                required
                                minLength={8}
                                value={password} // 追加
                                onChange={(e) => setPassword(e.target.value)} // 追加
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#34d399] transition-all text-sm"
                                placeholder="8文字以上で入力"
                            />
                        </div>

                        {/* 登録ボタン */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-[#2dd4bf] hover:bg-[#25b5a3] text-white font-bold rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2 mt-4 disabled:opacity-50 cursor-pointer "
                        >
                            {loading ? "登録中..." : "アカウントを作成する"}
                            {!loading && (
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
                            )}
                        </button>
                    </form>
                </div>

                {/* フッターエリア */}
                <div className="bg-slate-50 border-t border-slate-100 p-5 text-center">
                    <Link
                        href="/login"
                        className="text-sm font-bold text-[#1e3a8a] hover:underline flex justify-center items-center gap-1"
                    >
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
                                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                            />
                        </svg>
                        ログイン画面に戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}
