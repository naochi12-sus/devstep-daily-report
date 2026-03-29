"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    ChevronLeft,
    Pencil,
    Trash2,
    Calendar,
    User,
    MessageSquare,
    Send,
} from "lucide-react";

export default function ReportDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [report, setReport] = useState<any>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initialize = async () => {
            // 1. ログインユーザー情報の取得
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setCurrentUserId(user?.id || null);

            // 2. 日報データの取得
            const { data, error } = await supabase
                .from("reports")
                .select("*")
                .eq("id", id)
                .single();

            if (!error) setReport(data);
            setLoading(false);
        };
        initialize();
    }, [id]);

    // 削除処理 (Delete)
    const handleDelete = async () => {
        if (!confirm("この日報を削除してもよろしいですか？")) return;
        const { error } = await supabase.from("reports").delete().eq("id", id);
        if (!error) router.push("/");
    };

    if (loading) return <div className="p-10 text-center">読み込み中...</div>;
    if (!report)
        return <div className="p-10 text-center">データが見つかりません</div>;

    // 自分が作成した日報かどうか
    const isOwner = currentUserId === report.user_id;

    return (
        <div className="min-h-screen bg-[#f3f4f6] pb-10">
            {/* ヘッダー */}
            <header className="bg-[#1e3a8a] text-white p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-1 text-sm opacity-80 hover:opacity-100"
                    >
                        <ChevronLeft size={18} /> ダッシュボードに戻る
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
                {/* メインカード */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden">
                                    <img
                                        src={`https://api.dicebear.com/7.x/shapes/svg?seed=${report.user_name}`}
                                        alt="avatar"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-800">
                                            {report.user_name}
                                        </span>
                                        <span className="bg-[#2dd4bf] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                            開発
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                        <Calendar size={12} />{" "}
                                        {new Date(
                                            report.created_at,
                                        ).toLocaleString("ja-JP")}
                                    </div>
                                </div>
                            </div>

                            {/* 自分の投稿のみ編集・削除を表示 */}
                            {isOwner && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            router.push(`/reports/${id}/edit`)
                                        }
                                        className="p-2 text-slate-400 hover:text-[#2dd4bf] transition-colors"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <h1 className="text-2xl font-extrabold text-slate-800 mb-8 border-l-4 border-[#2dd4bf] pl-4">
                            {report.title}
                        </h1>

                        <div className="text-slate-600 leading-relaxed whitespace-pre-wrap min-h-[200px]">
                            {report.content}
                        </div>
                    </div>
                </div>

                {/* コメントセクション (デザイン再現) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2">
                        <MessageSquare size={18} className="text-[#2dd4bf]" />
                        <span className="font-bold text-slate-700">
                            コメント <span className="text-[#2dd4bf]">1件</span>
                        </span>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* サンプルコメント */}
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden">
                                <img
                                    src="https://api.dicebear.com/7.x/shapes/svg?seed=Sato"
                                    alt="avatar"
                                />
                            </div>
                            <div className="flex-1 bg-slate-50 p-4 rounded-2xl relative">
                                <div className="flex justify-between mb-1">
                                    <span className="font-bold text-sm text-slate-800">
                                        佐藤 花子
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        2024.05.24 19:15
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600">
                                    お疲れ様です！APIの実装、予定通り完了して素晴らしいですね。
                                </p>
                            </div>
                        </div>

                        {/* 入力欄 */}
                        <div className="flex gap-4 mt-8">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                                <img
                                    src={`https://api.dicebear.com/7.x/shapes/svg?seed=${report.user_name}`}
                                    alt="avatar"
                                />
                            </div>
                            <div className="flex-1 space-y-3">
                                <textarea
                                    placeholder={`${report.user_name}さんにコメントを送信...`}
                                    className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/20 focus:border-[#2dd4bf] transition-all"
                                    rows={3}
                                />
                                <div className="flex justify-end">
                                    <button className="bg-[#2dd4bf] hover:bg-[#25b5a3] text-white px-6 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2 transition-all active:scale-95">
                                        <Send size={16} /> 送信
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
