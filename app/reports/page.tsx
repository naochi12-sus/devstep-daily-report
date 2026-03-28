"use client";

import {
    Calendar,
    MessageSquare,
    Plus,
    Search,
    ChevronDown,
} from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-10">
                {/* Dashboard Title */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                        マイ・ダッシュボード
                    </h1>
                    <button className="bg-[#2dd4bf] hover:bg-[#25b5a3] text-white px-5 py-2.5 rounded-md font-semibold shadow-sm transition-colors flex items-center gap-2 text-sm">
                        <Plus className="h-4.5 w-4.5" strokeWidth={2.5} />
                        新規日報
                    </button>
                </div>

                {/* Filters */}
                <FilterBar />

                {/* Report Cards */}
                <div className="space-y-6">
                    <ReportCard
                        initials="山"
                        name="山田 太郎"
                        department="開発"
                        departmentColor="bg-[#2dd4bf]"
                        headerBgColor="bg-[#ecfeff]"
                        date="2024.05.24 18:30"
                        title="本日の開発進捗と来週の予定"
                        content="本日は〇〇機能のAPI実装を行いました。フロントエンドとの連携も完了し、正常に動作することを確認しています。明日はUIの仕上げに入ります。"
                        commentCount={3}
                    />
                    <ReportCard
                        initials="佐"
                        name="佐藤 花子"
                        department="会議"
                        departmentColor="bg-indigo-400"
                        headerBgColor="bg-[#eef2ff]"
                        date="2024.05.24 17:00"
                        title="チーム定例ミーティング議事録"
                        content="今週の振り返りと来週のタスク割り当てを行いました。Aさんのタスクについて相談事項があります。"
                        commentCount={0}
                    />
                </div>

                {/* Pagination */}
                <Pagination />
            </main>
        </div>
    );
}

function Header() {
    return (
        <header className="bg-[#1e3a8a] text-white shadow-md sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="text-xl font-bold tracking-wider">
                    DevStep Daily
                </div>

                <div className="hidden md:block w-1/3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                        <input
                            type="text"
                            placeholder="日報を検索..."
                            className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf] transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <span className="text-sm font-medium flex items-center gap-1">
                        山田 太郎
                        <ChevronDown className="h-4 w-4" />
                    </span>
                    <div className="h-9 w-9 rounded-full bg-white text-[#1e3a8a] flex items-center justify-center font-bold text-sm shadow-inner">
                        山
                    </div>
                </div>
            </div>
        </header>
    );
}

function FilterBar() {
    return (
        <div className="flex gap-3 mb-8">
            <select className="px-4 py-2 rounded-md border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf] shadow-sm">
                <option>2024/05/20 - 05/26</option>
            </select>
            <select className="px-4 py-2 rounded-md border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf] shadow-sm">
                <option>すべてのユーザー</option>
            </select>
            <select className="px-4 py-2 rounded-md border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf] shadow-sm">
                <option>すべてのカテゴリ</option>
            </select>
        </div>
    );
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
}: ReportCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header */}
            <div
                className={`p-6 pb-3 flex items-center gap-4 ${headerBgColor}`}
            >
                <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center text-slate-500 font-bold border border-slate-200">
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
                    <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                        <Calendar className="h-3.25 w-3.25" />
                        {date}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-4">
                <h3 className="text-lg font-bold text-slate-900 mb-1.5 hover:text-[#2dd4bf] transition-colors cursor-pointer">
                    {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                    {content}
                </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-100 flex justify-end">
                <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#2dd4bf] font-semibold transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    {commentCount}件
                </button>
            </div>
        </div>
    );
}

function Pagination() {
    return (
        <div className="flex justify-center items-center gap-2 mt-10">
            <button className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-400 text-sm font-medium disabled:opacity-50">
                前へ
            </button>
            <button className="px-3.5 py-1.5 border-2 border-[#2dd4bf] bg-[#2dd4bf]/10 text-[#2dd4bf] rounded-md font-bold text-sm">
                1
            </button>
            <button className="px-3.5 py-1.5 border border-slate-200 rounded-md text-slate-500 hover:border-[#2dd4bf] hover:text-[#2dd4bf] text-sm font-medium transition-colors">
                2
            </button>
            <button className="px-3.5 py-1.5 border border-slate-200 rounded-md text-slate-500 hover:border-[#2dd4bf] hover:text-[#2dd4bf] text-sm font-medium transition-colors">
                3
            </button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 hover:text-[#2dd4bf] hover:border-[#2dd4bf] text-sm font-medium transition-colors">
                次へ
            </button>
        </div>
    );
}
