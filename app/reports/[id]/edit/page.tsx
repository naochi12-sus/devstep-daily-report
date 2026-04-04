"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // URLからIDを取得するために追加
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Trash2, Save } from "lucide-react"; // アイコンライブラリを使用

export default function EditReportScreen() {
    const router = useRouter();
    const params = useParams(); // /reports/[id]/edit の [id] 部分を取得
    const reportId = params.id as string;

    // --- 状態管理 (State) ---
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("dev");
    const [content, setContent] = useState("");
    const [loginUser, setLoginUser] = useState("");

    // --- 1. 認証チェックと既存データの読み込み ---
    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true); // 念のためローディングを明示

            // 1. ログインユーザー情報の取得
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                setLoginUser(user.user_metadata.full_name || "名無し");
            } else {
                router.push("/login"); //ここがリダイレクト処理
                return; // 未認証の場合はここで処理を終了し、データ取得を防ぐ
            }

            //  2. ログインしていれば日報データを取得
            const { data, error } = await supabase
                .from("daily_reports")
                .select("*")
                .eq("id", reportId)
                .single(); // 1件だけ取得

            if (error) {
                alert("データの取得に失敗しました");
                router.push("/reports");
                return;
            }

            if (data) {
                // 他人の日報を編集できないようにするチェックを入れるとより安全
                if (data.user_id !== user.id) {
                    alert("他の人の日報は編集できません");
                    router.push("/reports");
                    return;
                }

                setTitle(data.title);
                setDate(data.date);
                setCategory(data.category);
                setContent(data.content);
            }
            setLoading(false);
        };

        if (reportId) fetchReport();
    }, [reportId, router]);

    // --- 2. 保存処理 (Update) ---
    const handleUpdate = async () => {
        if (!title || !date || !content) {
            alert("必須項目を入力してください");
            return;
        }

        const { error } = await supabase
            .from("daily_reports")
            .update({ title, date, category, content, updated_at: new Date() })
            .eq("id", reportId);

        if (error) {
            alert("更新に失敗しました: " + error.message);
        } else {
            alert("更新しました！");
            router.push(`/reports/${reportId}`); // 詳細画面へ戻る
        }
    };

    // --- 3. 削除処理 (Delete) ---
    const handleDelete = async () => {
        if (!confirm("本当にこの日報を削除しますか？")) return;

        const { error } = await supabase
            .from("daily_reports")
            .delete()
            .eq("id", reportId);

        if (error) {
            alert("削除に失敗しました");
        } else {
            router.push("/reports"); // 一覧へ戻る
        }
    };

    if (loading) return <div className="p-10 text-center">読み込み中...</div>;

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900">
            <header className="bg-[#1e3a8a] text-white shadow-md sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-xl font-bold tracking-wider ">
                        Team Activity Log
                    </div>
                    {/* ここでユーザー名を表示させる */}
                    <div className="text-sm font-medium">{loginUser} さん</div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="cursor-pointer p-2 -ml-2 text-slate-400 hover:text-[#2dd4bf] hover:bg-white rounded-full transition-all"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-extrabold text-slate-800">
                            日報の編集
                        </h1>
                    </div>

                    <button
                        onClick={handleDelete}
                        className="cursor-pointer flex items-center gap-1.5 text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors"
                    >
                        <Trash2 size={16} />
                        日報を削除
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">
                                    日付 *
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#2dd4bf] transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">
                                    カテゴリ *
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#2dd4bf] transition-all"
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
                                タイトル *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#2dd4bf] transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">
                                業務内容・所感 *
                            </label>
                            <textarea
                                rows={12}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#2dd4bf] transition-all resize-y"
                            ></textarea>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="cursor-pointer px-6 py-3 rounded-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                キャンセル
                            </button>

                            <button
                                type="button"
                                onClick={handleUpdate}
                                className="cursor-pointer px-8 py-3 rounded-lg font-bold text-white bg-[#2dd4bf] hover:bg-[#25b5a3] shadow-sm transition-colors flex items-center gap-2"
                            >
                                <Save size={18} />
                                変更を保存する
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
