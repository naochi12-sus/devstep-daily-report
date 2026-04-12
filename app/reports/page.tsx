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
    comments?: { count: number }[];
}

interface ReportCardProps {
    avatarUrl: string;
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
    const [userList, setUserList] = useState<string[]>([]); // ユーザー名のリスト
    const [selectedUser, setSelectedUser] = useState("すべてのユーザー"); // 選択されているユーザー
    const [currentPage, setCurrentPage] = useState(1); // 今のページ番号
    const [totalCount, setTotalCount] = useState(0); // 全体の投稿数
    const itemsPerPage = 5; // 1ページに表示する件数
    const [selectedCategory, setSelectedCategory] =
        useState("すべてのカテゴリ");
    const [dateFilter, setDateFilter] = useState<"all" | "today" | "yesterday">(
        "all",
    );

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            try {
                // 1. ログインユーザーチェック
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/login");
                    return;
                }
                setLoginUser(user.user_metadata.full_name || "名無し");

                // 2. ユーザー一覧（名前リスト）を作成するために全日報から名前を取る
                const { data: nameData } = await supabase
                    .from("daily_reports")
                    .select("user_name");
                if (nameData) {
                    const uniqueNames = Array.from(
                        new Set(
                            nameData.map((item) => item.user_name || "不明"),
                        ),
                    );
                    setUserList(uniqueNames);
                }

                // 3. 日報一覧の取得（絞り込み ＋ ページネーション）
                let query = supabase
                    .from("daily_reports")
                    .select("*, comments(count)", { count: "exact" });

                // ユーザーで絞り込み
                if (selectedUser !== "すべてのユーザー") {
                    query = query.eq("user_name", selectedUser);
                }

                // カテゴリで絞り込み
                if (selectedCategory !== "すべてのカテゴリ") {
                    // データベースの中身が 'dev' でも '開発' でも見つかるように「or」を使います
                    if (selectedCategory === "開発") {
                        query = query.or(`category.eq.開発,category.eq.dev`);
                    } else if (selectedCategory === "会議") {
                        query = query.or(
                            `category.eq.会議,category.eq.meeting`,
                        );
                    } else if (selectedCategory === "営業") {
                        query = query.or(`category.eq.営業,category.eq.sales`);
                    } else if (selectedCategory === "その他") {
                        query = query.or(
                            `category.eq.その他,category.eq.other`,
                        );
                    } else {
                        query = query.eq("category", selectedCategory);
                    }
                }

                // 日付で絞り込み
                if (dateFilter !== "all") {
                    const now = new Date();
                    const start = new Date(now);
                    const end = new Date(now);

                    if (dateFilter === "today") {
                        start.setHours(0, 0, 0, 0);
                        end.setHours(23, 59, 59, 999);
                    } else if (dateFilter === "yesterday") {
                        start.setDate(now.getDate() - 1);
                        start.setHours(0, 0, 0, 0);
                        end.setDate(now.getDate() - 1);
                        end.setHours(23, 59, 59, 999);
                    }
                    query = query
                        .gte("created_at", start.toISOString())
                        .lte("created_at", end.toISOString());
                }

                const from = (currentPage - 1) * itemsPerPage;
                const to = from + itemsPerPage - 1;

                const { data, error, count } = await query
                    .order("created_at", { ascending: false })
                    .range(from, to);

                if (error) throw error;

                setReports(data || []);
                setTotalCount(count || 0);
            } catch (error) {
                console.error("データ取得エラー:", error);
                const msg =
                    error instanceof Error
                        ? error.message
                        : "データの読み込みに失敗しました";
                alert(msg);
            } finally {
                setLoading(false); // 全て終わったらローディング解除
            }
        };
        initializeData(); // 依存配列
    }, [currentPage, selectedUser, selectedCategory, dateFilter, router]); // ページが変わるたびにこの一連の流れを再取得

    // カテゴリの英語名を日本語名に変換し、スタイルを返す関数
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
                    badge: "bg-[#fb923c]",
                    header: "bg-[#fff7ed]",
                };
            case "other":
            case "その他":
                return {
                    label: "その他",
                    badge: "bg-[#d946ef]",
                    header: "bg-[#fdf4ff]",
                };
            default:
                return {
                    label: category || "未分類",
                    badge: "bg-slate-500",
                    header: "bg-slate-50",
                };
        }
    };

    // ここで認証＆データ取得が終わるまで全体をローディングにする（チラつき防止）
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
                <Loader2 className="animate-spin text-slate-400" size={48} />
            </div>
        );
    }

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
                        className="bg-[#2dd4bf] hover:bg-[#25b5a3] text-white px-5 py-2.5 rounded-md font-semibold flex items-center gap-2 text-sm transition-colors shadow-sm active:scale-95 cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        日報作成
                    </button>
                </div>

                {/* 絞り込みエリア全体を包む箱 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                    {/* ユーザー絞り込み*/}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">
                            User
                        </label>
                        <FilterBar
                            users={userList}
                            selectedUser={selectedUser}
                            onUserChange={(name) => {
                                setSelectedUser(name);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    {/* カテゴリ絞り込み */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">
                            Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="h-10.5 px-4 py-2 rounded-md border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/20 focus:border-[#2dd4bf] transition-all cursor-pointer shadow-sm min-w-40"
                        >
                            <option value="すべてのカテゴリ">
                                すべてのカテゴリ
                            </option>
                            <option value="開発">開発</option>
                            <option value="会議">会議</option>
                            <option value="営業">営業</option>
                            <option value="その他">その他</option>
                        </select>
                    </div>

                    {/* 今日・昨日の切り替えボタン */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">
                            Quick Filter
                        </label>
                        <div className="flex bg-white p-1 rounded-md border border-slate-200 shadow-sm">
                            <button
                                onClick={() => {
                                    setDateFilter("all");
                                    setCurrentPage(1);
                                }}
                                className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${dateFilter === "all" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                全て
                            </button>
                            <button
                                onClick={() => {
                                    setDateFilter("today");
                                    setCurrentPage(1);
                                }}
                                className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${dateFilter === "today" ? "bg-[#2dd4bf] text-white" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                今日
                            </button>
                            <button
                                onClick={() => {
                                    setDateFilter("yesterday");
                                    setCurrentPage(1);
                                }}
                                className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${dateFilter === "yesterday" ? "bg-[#2dd4bf] text-white" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                昨日
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/*　日報を並べるための箱 */}
                    {/* データがあるか無いかだけの判定 */}
                    {reports.length > 0 ? (
                        <>
                            {reports.map((report) => {
                                // ここで日本語ラベルと色の情報を取得
                                const catInfo = getCategoryInfo(
                                    report.category,
                                );
                                return (
                                    <ReportCard
                                        key={report.id}
                                        onClick={() =>
                                            router.push(`/reports/${report.id}`)
                                        }
                                        name={report.user_name || "不明"}
                                        department={catInfo.label} // 日本語ラベルを渡す
                                        departmentColor={catInfo.badge}
                                        headerBgColor={catInfo.header}
                                        date={String(report.date)}
                                        title={report.title}
                                        content={report.content}
                                        commentCount={
                                            report.comments?.[0]?.count || 0
                                        }
                                        avatarUrl={`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(report.user_name || "guest")}`}
                                    />
                                );
                            })}
                            <div className="flex justify-center items-center gap-6 mt-10 pb-10">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => {
                                        setCurrentPage(currentPage - 1);
                                        window.scrollTo(0, 0);
                                    }}
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                                >
                                    前のページ
                                </button>

                                <span className="text-sm font-bold text-slate-500">
                                    {currentPage} /{" "}
                                    {Math.ceil(totalCount / itemsPerPage)}{" "}
                                    ページ
                                </span>

                                <button
                                    disabled={
                                        currentPage >=
                                        Math.ceil(totalCount / itemsPerPage)
                                    }
                                    onClick={() => {
                                        setCurrentPage(currentPage + 1);
                                        window.scrollTo(0, 0);
                                    }}
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                                >
                                    次のページ
                                </button>
                            </div>
                        </>
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
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.push("/login");
        } catch (error) {
            console.error("ログアウトエラー:", error);
            alert("ログアウトに失敗しました。もう一度お試しください。");
        }
    };

    return (
        <header className="bg-[#1e3a8a] text-white shadow-md sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="text-xl font-bold tracking-wider ">
                    Team Activity Log
                </div>
                <div className="flex items-center gap-4">
                    {/* ここから変更：プロフィール画面への遷移ボタン */}
                    <button
                        onClick={() => router.push("/profile")}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left"
                        title="プロフィールを編集"
                    >
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
                    </button>

                    <button
                        onClick={handleLogout}
                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors bg-white/10 ml-2 cursor-pointer"
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
    avatarUrl,
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
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
            style={{ cursor: "pointer" }}
        >
            <div
                className={`p-6 pb-3 flex items-center gap-4 ${headerBgColor}`}
            >
                <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center text-slate-500 font-bold border border-slate-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={avatarUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
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

function FilterBar({
    users,
    selectedUser,
    onUserChange,
}: {
    users: string[];
    selectedUser: string;
    onUserChange: (name: string) => void;
}) {
    return (
        <select
            value={selectedUser}
            onChange={(e) => onUserChange(e.target.value)}
            className="h-10.5 px-4 py-2 rounded-md border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/20 focus:border-[#2dd4bf] transition-all cursor-pointer shadow-sm min-w-40"
        >
            <option value="すべてのユーザー">すべてのユーザー</option>
            {users.map((name) => (
                <option key={name} value={name}>
                    {name}
                </option>
            ))}
        </select>
    );
}
