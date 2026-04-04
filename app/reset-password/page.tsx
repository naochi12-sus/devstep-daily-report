"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false); // 送信完了状態を管理

    const handleResetPassword = async (
        e: React.SubmitEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. パスワードリセットメールの送信
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                // メールのリンクを押した後に飛ばす先のURL
                redirectTo: `${window.location.origin}/update-password`,
            });

            // 2. エラーがあれば catch ブロックへ投げる
            if (error) throw error;

            // 3. 成功時
            setIsSent(true);
        } catch (error) {
            // 4. ここですべてのエラー（通信エラーなども含む）をキャッチ
            console.error("リセットメール送信エラー:", error);

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "予期せぬエラーが発生しました";

            alert("エラーが発生しました: " + errorMessage);
        } finally {
            // 5. 成功・失敗に関わらず、最後は必ずローディングを解除
            setLoading(false);
        }
    };

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
                    {/* 送信前と送信後で表示を切り替える */}
                    {!isSent ? (
                        <>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    パスワード再設定
                                </h2>
                                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                                    登録済みのメールアドレスを入力してください。パスワードをリセットするためのリンクを送信します。
                                </p>
                            </div>

                            <form
                                className="space-y-5"
                                onSubmit={handleResetPassword}
                            >
                                {/* メールアドレス */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        メールアドレス
                                    </label>
                                    <input
                                        type="email"
                                        value={email} // 今の値を表示
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        } // 入力されたらsetEmailで保存
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#34d399] focus:border-transparent transition-all text-sm"
                                        placeholder="name@example.com"
                                    />
                                </div>

                                {/* 送信ボタン */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2 mt-4 disabled:opacity-50 cursor-pointer "
                                >
                                    {loading
                                        ? "送信中..."
                                        : "再設定リンクを送信する"}
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
                                                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="mb-4 text-emerald-500 flex justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-16 h-16"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">
                                メールを送信しました
                            </h2>
                            <p className="text-sm text-slate-500">
                                {email} 宛に再設定リンクを送信しました。
                                <br />
                                メール内の指示に従って操作してください。
                            </p>
                        </div>
                    )}
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
