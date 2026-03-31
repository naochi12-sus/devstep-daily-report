"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Calendar, MessageSquare, Plus, LogOut, Loader2 } from "lucide-react";

// --- 1. 型定義 ---
interface Report {
    id: string;
    user_name: string;
    category: string;
    created_at: string;
    date: string;
    title: string;
    content: string;
}

interface ReportCardProps {
    initials: string;
    name: string;
    department: string;
    departmentColor: string;
    headerBgColor: string;
    date: string;
    title: string;
    content: string;
    commentCount: number;
    onClick: () => void;
}

// --- 2. メイン画面 ---
export default function Home() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [loginUser, setLoginUser] = useState("");
    const router = useRouter();

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);

            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                setLoginUser(user.user_metadata.full_name || "名無し");
            } else {
                router.push("/");
                return;
            }

            const { data, error } = await supabase
                .from("daily_reports")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("データ取得エラー:", error.message);
            } else {
                setReports(data || []);
            }
            setLoading(false);
        };
        initializeData();
    }, [router]);

    // ✅ カテゴリの英語名を日本語名に変換し、スタイルを返す関数
    const getCategoryInfo = (category: string) => {
        switch (category) {
            case "dev":
            case "開発":
                return {
                    label: "開発",
                    badge: "bg-[#2dd4bf]",
                    header: "bg-[#ecfeff]",
                };
            case "meeting":
            case "会議":
                return {
                    label: "会議",
                    badge: "bg-[#3b82f6]",
                    header: "bg-[#eff6ff]",
                };
            case "sales":
            case "営業":
                return {
                    label: "営業",
                    badge: "bg-[#fb923c]", // 暖かみのあるオレンジ
                    header: "bg-[#fff7ed]",
                };
            case "other":
            case "その他":
                return {
                    label: "その他",
                    badge: "bg-[#d946ef]", // 明るいマゼンタ（かわいいピンク系）
                    header: "bg-[#fdf4ff]", // ごく薄いピンクパープル
                };
            default:
                return {
                    label: category || "未分類",
                    badge: "bg-slate-500",
                    header: "bg-slate-50",
                };
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900">
            <Header userName={loginUser} />

            <main className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-800">
                        マイ・ダッシュボード
                    </h1>
                    <button
                        onClick={() => router.push("/reports/new")}
                        className="bg-[#2dd4bf] hover:bg-[#25b5a3] text-white px-5 py-2.5 rounded-md font-semibold flex items-center gap-2 text-sm transition-colors shadow-sm active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        新規日報
                    </button>
                </div>

                <FilterBar />

                <div className="space-y-6">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2
                                className="animate-spin text-slate-400"
                                size={32}
                            />
                        </div>
                    ) : reports.length > 0 ? (
                        reports.map((report) => {
                            // ✅ ここで日本語ラベルと色の情報を取得
                            const catInfo = getCategoryInfo(report.category);
                            return (
                                <ReportCard
                                    key={report.id}
                                    onClick={() =>
                                        router.push(`/reports/${report.id}`)
                                    }
                                    initials={
                                        report.user_name?.charAt(0) || "？"
                                    }
                                    name={report.user_name || "不明"}
                                    department={catInfo.label} // 日本語ラベルを渡す
                                    departmentColor={catInfo.badge}
                                    headerBgColor={catInfo.header}
                                    date={
                                        report.date
                                            ? new Date(
                                                  report.date,
                                              ).toLocaleDateString("ja-JP")
                                            : "日付不明"
                                    }
                                    title={report.title}
                                    content={report.content}
                                    commentCount={0}
                                />
                            );
                        })
                    ) : (
                        <p className="text-center text-slate-500 py-20 bg-white rounded-xl border border-dashed border-slate-300">
                            日報がまだありません。
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}

// --- 3. サブコンポーネント ---

function Header({ userName }: { userName: string }) {
    const router = useRouter();
    const avatarUrl = userName
        ? `https://api.dicebear.com/7.x/shapes/svg?seed=${userName}`
        : "";

    const handleLogout = async () => {
        if (!confirm("ログアウトしますか？")) return;
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <header className="bg-[#1e3a8a] text-white shadow-md sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                <div
                    className="text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => router.push("/reports")}
                >
                    Team Activity Log
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{userName}</span>
                        <div className="h-9 w-9 rounded-full bg-white overflow-hidden border border-white/20">
                            {avatarUrl && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={avatarUrl}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors bg-white/10 ml-2"
                        title="ログアウト"
                    >
                        <LogOut size={22} />
                    </button>
                </div>
            </div>
        </header>
    );
}

function ReportCard({
    initials,
    name,
    department,
    departmentColor,
    headerBgColor,
    date,
    title,
    content,
    commentCount,
    onClick,
}: ReportCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
        >
            <div
                className={`p-6 pb-3 flex items-center gap-4 ${headerBgColor}`}
            >
                <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center text-slate-500 font-bold border border-slate-100">
                    {initials}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="font-bold text-slate-800">{name}</h2>
                        <span
                            className={`${departmentColor} text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wider`}
                        >
                            {department}
                        </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> {date}
                    </div>
                </div>
            </div>
            <div className="px-6 pb-4 pt-2">
                <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-[#2dd4bf] transition-colors">
                    {title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                    {content}
                </p>
                <div className="flex justify-end mt-4 opacity-50 text-slate-400">
                    <div className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        <span className="text-xs font-bold">
                            {commentCount}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FilterBar() {
    return (
        <div className="flex gap-3 mb-8">
            <select className="px-4 py-2 rounded-md border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/20 focus:border-[#2dd4bf] transition-all cursor-pointer">
                <option>すべてのユーザー</option>
            </select>
        </div>
    );
}
