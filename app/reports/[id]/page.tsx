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
    Loader2,
} from "lucide-react";

// --- 1. 型定義 ---
interface Report {
    id: string;
    user_id: string;
    category: string;
    title: string;
    content: string;
    created_at: string;
    user_name: string;
}

interface Comment {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    user_name: string;
}

export default function ReportDetail() {
    const { id } = useParams();
    const router = useRouter();

    const [report, setReport] = useState<Report | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loginUser, setLoginUser] = useState("");
    const [loading, setLoading] = useState(true);

    // カテゴリ情報を判定する関数
    const getCategoryInfo = (category: string) => {
        switch (category) {
            case "dev":
            case "開発":
                return {
                    label: "開発",
                    badge: "bg-[#2dd4bf]",
                    border: "border-[#2dd4bf]",
                    header: "bg-[#ecfeff]",
                };
            case "meeting":
            case "会議":
                return {
                    label: "会議",
                    badge: "bg-[#3b82f6]",
                    border: "border-[#3b82f6]",
                    header: "bg-[#eff6ff]",
                };
            case "sales":
            case "営業":
                return {
                    label: "営業",
                    badge: "bg-[#fb923c]",
                    border: "border-[#fb923c]",
                    header: "bg-[#fff7ed]",
                };
            case "other":
            case "その他":
                return {
                    label: "その他",
                    badge: "bg-[#d946ef]",
                    border: "border-[#d946ef]",
                    header: "bg-[#fdf4ff]",
                };
            default:
                return {
                    label: category || "未分類",
                    badge: "bg-slate-500",
                    border: "border-slate-500",
                    header: "bg-slate-50",
                };
        }
    };

    useEffect(() => {
        const initialize = async () => {
            setLoading(true);
            try {
                // 1. ログインユーザーチェック
                const {
                    data: { user },
                    error: authError,
                } = await supabase.auth.getUser();
                if (authError || !user) {
                    router.replace("/login");
                    return;
                }

                setLoginUser(user.user_metadata.full_name || "名無し");
                setCurrentUserId(user.id);

                // 2. 日報データの取得
                const { data: reportData, error: reportError } = await supabase
                    .from("daily_reports")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (reportError) throw reportError; // エラーがあれば catch へ
                if (!reportData) throw new Error("日報が見つかりませんでした");

                setReport(reportData);

                // 3. コメントデータの読み込み
                const { data: commentData, error: commentError } =
                    await supabase
                        .from("comments")
                        .select("*")
                        .eq("report_id", id)
                        .order("created_at", { ascending: true });

                if (commentError) throw commentError;
                setComments(commentData || []);
            } catch (error) {
                console.error("データ取得エラー:", error);
                // エラーの中身を確認してメッセージを作る
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "予期せぬエラーが発生しました";

                alert("データの読み込みに失敗しました: " + errorMessage);
                router.push("/reports");
            } finally {
                setLoading(false);
            }
        };
        initialize();
    }, [id, router]);

    const handleDelete = async () => {
        if (!confirm("この日報を削除してもよろしいですか？")) return;

        try {
            const { error } = await supabase
                .from("daily_reports")
                .delete()
                .eq("id", id);

            if (error) throw error;

            alert("削除しました");
            router.push("/reports");
        } catch (error) {
            console.error("削除エラー:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "予期せぬエラーが発生しました";
            alert("削除に失敗しました: " + errorMessage);
        }
    };

    // 本物のコメント投稿処理 (Supabaseへ保存)
    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !currentUserId) return;

        try {
            const { data, error } = await supabase
                .from("comments")
                .insert([
                    {
                        report_id: id,
                        user_id: currentUserId,
                        content: newComment,
                        user_name: loginUser,
                    },
                ])
                .select("*")
                .single();

            if (error) throw error;

            if (data) {
                setComments([...comments, data]);
                setNewComment("");
            }
        } catch (error) {
            console.error("コメント投稿エラー:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "予期せぬエラーが発生しました";
            alert("コメントの送信に失敗しました: " + errorMessage);
        }
    };

    // 読み込み中
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
                <Loader2 className="animate-spin text-[#2dd4bf]" size={40} />
            </div>
        );
    }

    // データが見つからない（404的な状態）
    if (!report) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6] gap-4">
                <p className="text-slate-500 font-bold">
                    日報が見つかりませんでした。
                </p>
                <button
                    onClick={() => router.push("/reports")}
                    className="text-[#2dd4bf] hover:underline"
                >
                    一覧に戻る
                </button>
            </div>
        );
    }

    const isOwner = currentUserId === report.user_id;
    const catInfo = getCategoryInfo(report.category);

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900">
            {/* ヘッダー */}
            <header className="bg-[#1e3a8a] text-white shadow-md sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-xl font-bold tracking-wider ">
                        {/* アプリ名を表示させる */}
                        Team Activity Log
                    </div>
                    {/* ユーザー名を表示させる */}
                    <div className="text-sm font-medium">{loginUser} さん</div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
                {/* 戻るボタンとタイトル */}
                <div className="mb-6 flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="relative z-10 cursor-pointer p-2 -ml-2 text-slate-400 hover:text-[#2dd4bf] hover:bg-white rounded-full transition-all "
                    >
                        {/* pointer-events-none でアイコンへの直接のマウス干渉を防ぐ */}
                        <ChevronLeft
                            size={24}
                            className="pointer-events-none"
                        />
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                        日報詳細画面
                    </h1>
                </div>

                {/* 日報詳細カード */}
                <div
                    className={`bg-white rounded-xl shadow-sm border-t-4 ${catInfo.border} border-x border-b border-slate-200 overflow-hidden`}
                >
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`https://api.dicebear.com/7.x/shapes/svg?seed=${report.user_name}`}
                                        alt="avatar"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-800">
                                            {report.user_name || "名前なし"}
                                        </span>
                                        {/* カテゴリタグを日本語＆テーマカラーに */}
                                        <span
                                            className={`${catInfo.badge} text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider`}
                                        >
                                            {catInfo.label}
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
                                        className="cursor-pointer p-2 text-slate-400 hover:text-[#2dd4bf] hover:bg-slate-50 rounded-full transition-all"
                                        title="編集"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="cursor-pointer p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                        title="削除"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* タイトルの左側の線もテーマカラーに */}
                        <h1
                            className={`text-2xl font-extrabold text-slate-800 mb-8 border-l-4 ${catInfo.border} pl-4`}
                        >
                            {report.title}
                        </h1>

                        <div className="text-slate-600 leading-relaxed whitespace-pre-wrap min-h-37.5">
                            {report.content}
                        </div>
                    </div>
                </div>

                {/* コメントカード */}
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
                        {comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="flex gap-4 animate-in fade-in slide-in-from-bottom-2"
                            >
                                <div className="h-10 w-10 rounded-full bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
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

                        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                            <div className="h-10 w-10 rounded-full bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
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
                                        className="px-8 py-3 rounded-lg font-bold text-white bg-[#2dd4bf] hover:bg-[#25b5a3] shadow-sm transition-colors flex items-center gap-2 cursor-pointer "
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
