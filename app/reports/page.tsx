"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    Calendar,
    MessageSquare,
    Plus,
    Search,
    // ChevronDown は使っていないので削除しました
} from "lucide-react";

// 1. 日報の型定義（1回だけ記述）
interface Report {
    id: string;
    user_name: string;
    category: string;
    created_at: string;
    date: string;
    title: string;
    content: string;
}

// 2. メインの画面（Home）
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
            }

            const { data, error } = await supabase
                .from("daily_reports")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error) {
                setReports(data || []);
            }
            setLoading(false);
        };
        initializeData();
    }, []);

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900">
            <Header userName={loginUser} />
            <main className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                        マイ・ダッシュボード
                    </h1>
                    <button
                        onClick={() => router.push("/reports/new")}
                        className="bg-[#2dd4bf] hover:bg-[#25b5a3] text-white px-5 py-2.5 rounded-md font-semibold shadow-sm transition-colors flex items-center gap-2 text-sm"
                    >
                        <Plus className="h-4.5 w-4.5" strokeWidth={2.5} />
                        新規日報
                    </button>
                </div>
                <FilterBar />
                <div className="space-y-6">
                    {loading ? (
                        <p className="text-center text-slate-500 py-10">
                            読み込み中...
                        </p>
                    ) : reports.length > 0 ? (
                        reports.map((report) => (
                            <ReportCard
                                key={report.id}
                                onClick={() =>
                                    router.push(`/reports/${report.id}`)
                                }
                                initials={report.user_name?.charAt(0) || "？"}
                                name={report.user_name || "不明"}
                                department={report.category || "未分類"}
                                departmentColor="bg-[#2dd4bf]"
                                headerBgColor="bg-[#ecfeff]"
                                date={
                                    report.date
                                        ? new Date(
                                              report.date,
                                          ).toLocaleDateString("ja-JP")
                                        : "日付なし"
                                }
                                title={report.title}
                                content={report.content}
                                commentCount={0}
                            />
                        ))
                    ) : (
                        <p className="text-center text-slate-500 py-20 bg-white rounded-xl border border-dashed border-slate-300">
                            日報がまだありません。
                        </p>
                    )}
                </div>
                <Pagination />
            </main>
        </div>
    );
}

// 3. サブコンポーネント群（ここから下は各名前1つずつ！）

function Header({ userName }: { userName: string }) {
    const avatarUrl = userName
        ? `https://api.dicebear.com/7.x/shapes/svg?seed=${userName}&backgroundColor=0a5b83,1c799f,69d2e7,f1f4dc,f88c49`
        : "";
    return (
        <header className="bg-[#1e3a8a] text-white shadow-md sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="text-xl font-bold tracking-wider">
                    Team Activity Log
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{userName} ▼</span>
                    <div className="h-9 w-9 rounded-full bg-white overflow-hidden border border-white/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={avatarUrl}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
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
}: any) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
        >
            <div
                className={`p-6 pb-3 flex items-center gap-4 ${headerBgColor}`}
            >
                <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center text-slate-500 font-bold border border-slate-200 shadow-sm">
                    {initials}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="font-bold text-slate-800 text-base">
                            {name}
                        </h2>
                        <span
                            className={`${departmentColor} text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-wide`}
                        >
                            {department}
                        </span>
                    </div>
                    <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 leading-none">
                        <Calendar className="h-3.5 w-3.5" /> {date}
                    </div>
                </div>
            </div>
            <div className="px-6 pb-4 pt-2">
                <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-[#2dd4bf] transition-colors">
                    {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                    {content}
                </p>
                {/* commentCount を使う場合はここにMessageSquareなどを配置します */}
                <div className="flex justify-end mt-2 opacity-50">
                    <MessageSquare size={14} className="mr-1" />{" "}
                    <span className="text-xs font-bold">{commentCount}</span>
                </div>
            </div>
        </div>
    );
}

function FilterBar() {
    return (
        <div className="flex gap-3 mb-8">
            <select className="px-4 py-2 rounded-md border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none">
                <option>すべてのユーザー</option>
            </select>
        </div>
    );
}

function Pagination() {
    return (
        <div className="flex justify-center mt-10">
            <button className="px-4 py-2 bg-[#2dd4bf]/10 text-[#2dd4bf] border-2 border-[#2dd4bf] rounded-md font-bold text-sm">
                1
            </button>
        </div>
    );
}
