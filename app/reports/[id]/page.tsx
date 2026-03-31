"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    ChevronLeft,
    Pencil,
    Trash2,
    Calendar,
    MessageSquare,
    Send,
} from "lucide-react";

// --- 1. 型定義 (any禁止ルールに対応) ---
interface Report {
    id: string;
    user_id: string;
    user_name: string;
    category: string;
    title: string;
    content: string;
    created_at: string;
}

interface Comment {
    id: string;
    user_id: string;
    user_name: string; // 本来はusersテーブルと結合しますが、まずは簡易的に
    content: string;
    created_at: string;
}

export default function ReportDetail() {
    const { id } = useParams();
    const router = useRouter();

    // 状態管理
    const [report, setReport] = useState<Report | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initialize = async () => {
            // 1. ログインユーザー情報の取得
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setCurrentUserId(user?.id || null);

            // 2. 日報データの取得 (テーブル名を daily_reports に修正)
            const { data, error } = await supabase
                .from("daily_reports")
                .select("*")
                .eq("id", id)
                .single();

            if (!error) {
                setReport(data);
                // 3. 本来はここでコメントも取得します（今回は一旦空配列）
            }
            setLoading(false);
        };
        initialize();
    }, [id]);

    // 削除処理
    const handleDelete = async () => {
        if (!confirm("この日報を削除してもよろしいですか？")) return;
        const { error } = await supabase
            .from("daily_reports")
            .delete()
            .eq("id", id);

        if (!error) {
            alert("削除しました");
            router.push("/reports"); // 一覧へ戻る
        }
    };

    // コメント投稿処理 (追加)
    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        // 本来は supabase.from("comments").insert(...) を行いますが、
        // 現時点では画面上の反映のみシミュレーション
        const mockComment: Comment = {
            id: Math.random().toString(),
            user_id: currentUserId || "",
            user_name: "自分",
            content: newComment,
            created_at: new Date().toISOString(),
        };

        setComments([...comments, mockComment]);
        setNewComment("");
        alert("コメントを送信しました（DB連携は別途実装）");
    };

    if (loading)
        return (
            <div className="p-10 text-center text-slate-500">読み込み中...</div>
        );
    if (!report)
        return (
            <div className="p-10 text-center text-slate-500">
                データが見つかりません
            </div>
        );

    const isOwner = currentUserId === report.user_id;

    return (
        <div className="min-h-screen bg-[#f3f4f6] pb-10 font-sans">
            <header className="bg-[#1e3a8a] text-white p-4 sticky top-0 z-10 shadow-md">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-1 text-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={18} /> ダッシュボードに戻る
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
                {/* 日報メインカード */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
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
                                        <span className="bg-[#2dd4bf] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                            {report.category}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                        <Calendar size={12} />
                                        {new Date(
                                            report.created_at,
                                        ).toLocaleString("ja-JP")}
                                    </div>
                                </div>
                            </div>

                            {isOwner && (
                                <div className="flex gap-1">
                                    <button
                                        onClick={() =>
                                            router.push(`/reports/${id}/edit`)
                                        }
                                        className="p-2 text-slate-400 hover:text-[#2dd4bf] hover:bg-slate-50 rounded-full transition-all"
                                        title="編集"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                        title="削除"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <h1 className="text-2xl font-extrabold text-slate-800 mb-8 border-l-4 border-[#2dd4bf] pl-4">
                            {report.title}
                        </h1>

                        <div className="text-slate-600 leading-relaxed whitespace-pre-wrap min-h-37.5">
                            {report.content}
                        </div>
                    </div>
                </div>

                {/* コメントセクション */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50">
                        <MessageSquare size={18} className="text-[#2dd4bf]" />
                        <span className="font-bold text-slate-700">
                            コメント{" "}
                            <span className="text-[#2dd4bf]">
                                {comments.length}件
                            </span>
                        </span>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* コメント一覧 */}
                        {comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="flex gap-4 animate-in fade-in slide-in-from-bottom-2"
                            >
                                <div className="h-10 w-10 rounded-full bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                                    <img
                                        src={`https://api.dicebear.com/7.x/shapes/svg?seed=${comment.user_name}`}
                                        alt="avatar"
                                    />
                                </div>
                                <div className="flex-1 bg-slate-50 p-4 rounded-2xl relative">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-bold text-sm text-slate-800">
                                            {comment.user_name}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            {new Date(
                                                comment.created_at,
                                            ).toLocaleString("ja-JP")}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* 入力エリア */}
                        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                            <div className="h-10 w-10 rounded-full bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                                <img
                                    src={`https://api.dicebear.com/7.x/shapes/svg?seed=${currentUserId}`}
                                    alt="my avatar"
                                />
                            </div>
                            <div className="flex-1 space-y-3">
                                <textarea
                                    value={newComment}
                                    onChange={(e) =>
                                        setNewComment(e.target.value)
                                    }
                                    placeholder="コメントを入力..."
                                    className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/20 focus:border-[#2dd4bf] transition-all resize-none"
                                    rows={3}
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleCommentSubmit}
                                        disabled={!newComment.trim()}
                                        className="bg-[#2dd4bf] hover:bg-[#25b5a3] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2 transition-all active:scale-95"
                                    >
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
