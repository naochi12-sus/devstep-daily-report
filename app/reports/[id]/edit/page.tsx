"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // URLからIDを取得するために追加
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Trash2, LogOut, Save } from "lucide-react"; // アイコンライブラリを使用

export default function EditReportScreen() {
    const router = useRouter();
    const params = useParams(); // /reports/[id]/edit の [id] 部分を取得
    const reportId = params.id as string;

    // --- 1.状態管理 (State) ---
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("dev");
    const [content, setContent] = useState("");

    // ヘッダー用：ログインしている人の名前を入れる
    const [userName, setUserName] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // --- 2.ログアウト処理 ---
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

    // --- 3.認証チェックと既存データの読み込み ---
    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                // A. ログインユーザーチェック
                const {
                    data: { user },
                    error: authError,
                } = await supabase.auth.getUser();
                if (authError || !user) {
                    router.replace("/login");
                    return;
                }
                setUserName(user.user_metadata.full_name || "名無し");

                // B. 日報データの取得
                const { data, error } = await supabase
                    .from("daily_reports")
                    .select("*")
                    .eq("id", reportId)
                    .single();

                if (error) throw error; // 取得エラーなら catch へ

                if (data) {
                    // 他人の日報を編集できないようにするチェック
                    if (data.user_id !== user.id) {
                        alert("ご自身の日報以外は編集できません。");
                        router.push("/reports");
                        return;
                    }
                    setTitle(data.title);
                    setDate(data.date);
                    setCategory(data.category);
                    setContent(data.content);
                }
            } catch (error) {
                console.error("読み込みエラー:", error);
                alert("データの取得に失敗しました。一覧に戻ります。");
                router.push("/reports");
            } finally {
                setLoading(false);
            }
        };

        if (reportId) fetchReport();
    }, [reportId, router]);

    // --- 4. 保存処理 (Update) ---
    const handleUpdate = async () => {
        // まずエラー表示をクリアする
        setErrors({});
        const newErrors: { [key: string]: string } = {};

        // 各項目をチェックしていく
        if (!title.trim()) {
            newErrors.title = "タイトルを入力してください。";
        } else if (title.length > 50) {
            newErrors.title = "タイトルは50文字以内で入力してください。";
        }

        if (!date) {
            newErrors.date = "日付を選択してください。";
        }

        if (!content.trim()) {
            newErrors.content = "業務内容を入力してください。";
        } else if (content.length > 2000) {
            newErrors.content = "業務内容は2000文字以内で入力してください。";
        }

        // １つでもエラーがあれば、ここで処理を止める
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Supabaseへの保存（下の処理）に行かせない
        }

        // --- ここから下は「エラーがなかった場合」だけ実行される ---
        setLoading(true);
        try {
            const { error } = await supabase
                .from("daily_reports")
                .update({
                    title,
                    date,
                    category,
                    content,
                    updated_at: new Date(),
                })
                .eq("id", reportId);

            if (error) throw error;

            alert("更新しました！");
            router.replace("/reports");
        } catch (error) {
            console.error("更新エラー:", error);
            const msg =
                error instanceof Error ? error.message : "予期せぬエラー";
            alert("更新に失敗しました: " + msg);
        } finally {
            setLoading(false);
        }
    };

    // --- 5. 削除処理 (Delete) ---
    const handleDelete = async () => {
        if (!confirm("本当にこの日報を削除しますか？")) return;

        setLoading(true); // 削除中もガードをかける
        try {
            const { error } = await supabase
                .from("daily_reports")
                .delete()
                .eq("id", reportId);

            if (error) throw error;

            alert("削除しました。");
            router.push("/reports");
        } catch (error) {
            console.error("削除エラー:", error);
            const msg =
                error instanceof Error
                    ? error.message
                    : "予期せぬエラーが発生しました";
            alert("削除に失敗しました: " + msg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">読み込み中...</div>;

    // アバターURLの生成（userNameがセットされたら自動で作られる）
    const avatarUrl = userName
        ? `https://api.dicebear.com/7.x/shapes/svg?seed=${userName}`
        : "";

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900">
            {/* ヘッダー */}
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
                            <span className="text-sm font-medium">
                                {userName}
                            </span>
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
                                    日付 <span className="text-red-500">*</span>
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
                                    カテゴリ{" "}
                                    <span className="text-red-500">*</span>
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
                                タイトル <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                maxLength={50}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.title
                                        ? "border-red-500 ring-2 ring-red-500/10"
                                        : "border-slate-200"
                                } bg-slate-50 focus:bg-white focus:outline-none focus:border-[#2dd4bf] transition-all`}
                            />
                            <div className="flex justify-between mt-1">
                                <p className="text-xs text-red-500 font-bold">
                                    {errors.title}
                                </p>
                                <p
                                    className={`text-xs ${title.length > 50 ? "text-red-500" : "text-slate-400"}`}
                                >
                                    {title.length} / 50
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">
                                業務内容・所感{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={12}
                                value={content}
                                maxLength={2000}
                                onChange={(e) => setContent(e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.content
                                        ? "border-red-500 ring-2 ring-red-500/10"
                                        : "border-slate-200"
                                } bg-slate-50 focus:bg-white focus:outline-none focus:border-[#2dd4bf] transition-all resize-y`}
                            ></textarea>
                            <div className="flex justify-between mt-1">
                                <p className="text-xs text-red-500 font-bold">
                                    {errors.content}
                                </p>
                                <p
                                    className={`text-xs ${content.length > 2000 ? "text-red-500" : "text-slate-400"}`}
                                >
                                    {content.length} / 2000
                                </p>
                            </div>
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
                                disabled={loading}
                                className="cursor-pointer px-8 py-3 rounded-lg font-bold text-white bg-[#2dd4bf] hover:bg-[#25b5a3] shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin mr-2">
                                            ⏳
                                        </span>
                                        保存中...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        変更を保存する
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
