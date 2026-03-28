"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UpdatePasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 新しいパスワードでユーザー情報を更新する
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            alert("更新エラー: " + error.message);
        } else {
            alert("パスワードが更新されました！");
            router.push("/login"); // ログイン画面へ
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    新しいパスワードの設定
                </h2>
                <form onSubmit={handleUpdate} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            新しいパスワード
                        </label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#34d399] outline-none"
                            placeholder="8文字以上で入力"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-lg disabled:opacity-50"
                    >
                        {loading ? "更新中..." : "パスワードを保存する"}
                    </button>
                </form>
            </div>
        </div>
    );
}
