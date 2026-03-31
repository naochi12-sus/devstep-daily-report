"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Save, Loader2 } from "lucide-react";

export default function CreateReportScreen() {
    const router = useRouter();

    // --- 状態管理 (State) ---
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("dev");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState<string | null>(null);

    // --- ユーザー情報の初期取得 ---
    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                setUserName(user.user_metadata.full_name || "名無し");
                setUserId(user.id);
            }
        };
        getUser();
    }, []);

    // --- 保存処理 (Handle Submit) ---
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            alert("セッションが切れました。再ログインしてください。");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.from("daily_reports").insert([
                {
                    user_id: userId,
                    user_name: userName,
                    title: title,
                    content: content,
                    category: category,
                    date: date,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ]);

            if (error) {
                alert("保存に失敗しました: " + error.message);
                console.error(error);
                setLoading(false); // エラー時はボタンを元に戻す
            } else {
                alert("日報を保存しました！"); // ダッシュボードへ戻る
                router.push("/reports"); // 一覧へ戻る
            }
        } catch (err) {
            console.error("予期せぬエラー:", err);
            setLoading(false);
        }
    };

    // プレビュー用アバターURL
    const avatarUrl = userName
        ? `https://api.dicebear.com/7.x/shapes/svg?seed=${userName}&backgroundColor=0a5b83,1c799f,69d2e7,f1f4dc,f88c49`
        : "";

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900">
            {/* ヘッダー */}
            <header className="bg-[#1e3a8a] text-white shadow-md sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div
                        onClick={() => router.push("/")}
                        className="text-xl font-bold tracking-wider cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        Team Activity Log
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                            {userName ? `${userName} ▼` : "読み込み中..."}
                        </span>
                        <div className="h-9 w-9 rounded-full bg-white text-[#1e3a8a] overflow-hidden shadow-inner border border-slate-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-10">
                {/* 戻るボタンとタイトル */}
                <div className="mb-6 flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 text-slate-400 hover:text-[#2dd4bf] hover:bg-white rounded-full transition-all"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                        新規日報作成
                    </h1>
                </div>

                {/* フォームカード */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <form className="p-8 space-y-6" onSubmit={handleSave}>
                        {/* 日付とカテゴリ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">
                                    日付 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:border-[#2dd4bf] focus:ring-2 focus:ring-[#2dd4bf]/20 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">
                                    カテゴリ{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:border-[#2dd4bf] focus:ring-2 focus:ring-[#2dd4bf]/20 transition-all"
                                >
                                    <option value="dev">開発</option>
                                    <option value="meeting">会議</option>
                                    <option value="sales">営業</option>
                                    <option value="other">その他</option>
                                </select>
                            </div>
                        </div>

                        {/* タイトル */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">
                                タイトル <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="例：本日の開発進捗について"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:border-[#2dd4bf] focus:ring-2 focus:ring-[#2dd4bf]/20 transition-all"
                                required
                                maxLength={50}
                            />
                        </div>

                        {/* 本文 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">
                                業務内容・所感{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={10}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="本日の業務内容や気づきを記入してください"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm leading-relaxed focus:bg-white focus:outline-none focus:border-[#2dd4bf] focus:ring-2 focus:ring-[#2dd4bf]/20 transition-all resize-y min-h-37.5"
                                required
                            ></textarea>
                        </div>

                        {/* フッターボタン */}
                        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => router.push("/")}
                                className="px-6 py-3 rounded-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-lg font-bold text-white bg-[#2dd4bf] hover:bg-[#25b5a3] shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            className="animate-spin"
                                            size={18}
                                        />
                                        保存中...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        日報を保存する
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
