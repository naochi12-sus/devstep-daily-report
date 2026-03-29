"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CreateReportScreen() {
    // 新規作成なので名前を変更
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("dev");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState<string | null>(null); // user_id保持用

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                setUserName(user.user_metadata.full_name || "名無し");
                setUserId(user.id); // 自分のIDをセット
            }
        };
        getUser();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return alert("ログインしてください");

        setLoading(true);

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
        } else {
            alert("日報を保存しました！");
            router.push("/"); // ダッシュボードへ戻る
        }
        setLoading(false);
    };

    // --- 以下、JSX（見た目）の部分は変更なしでOK ---
    const avatarUrl = userName
        ? `https://api.dicebear.com/7.x/shapes/svg?seed=${userName}&backgroundColor=0a5b83,1c799f,69d2e7,f1f4dc,f88c49`
        : "";

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900">
            <header className="bg-[#1e3a8a] text-white shadow-md sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div
                        onClick={() => router.push("/")}
                        className="text-xl font-bold tracking-wider cursor-pointer"
                    >
                        Team Activity Log
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                            {userName ? `${userName} ▼` : "読み込み中..."}
                        </span>
                        <div className="h-9 w-9 rounded-full bg-white text-[#1e3a8a] overflow-hidden shadow-inner border border-slate-200">
                            <img
                                src={avatarUrl}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-10">
                <div className="mb-6 flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="text-slate-400 hover:text-[#2dd4bf] transition-colors"
                    >
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
                        新規日報作成
                    </h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <form className="p-8 space-y-6" onSubmit={handleSave}>
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
                            />
                        </div>
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
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm leading-relaxed focus:bg-white focus:outline-none focus:border-[#2dd4bf] focus:ring-2 focus:ring-[#2dd4bf]/20 transition-all resize-y"
                                required
                            ></textarea>
                        </div>
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
                                className="px-8 py-3 rounded-lg font-bold text-white bg-[#2dd4bf] hover:bg-[#25b5a3] shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? "保存中..." : "日報を保存する"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
