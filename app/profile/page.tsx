"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Check, Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";

export default function ProfileEditPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            // 1. まずローディングを開始する
            setLoading(true);

            try {
                // 2. ユーザー情報を取得
                const {
                    data: { user },
                    error,
                } = await supabase.auth.getUser();

                // 3. ユーザーがいない、またはエラーがある場合は即リダイレクト
                if (!user || error) {
                    // ログインしていない場合はリダイレクトして終了
                    router.replace("/login");
                    return;
                }

                // 4. ユーザーがいた場合のみ、画面に表示する値をセットする
                // ここで「ユーザーがいたこと」を記録
                setUser(user);
                setName(user.user_metadata.full_name || "");
                setEmail(user.email || "");
            } catch (error) {
                console.error("通信エラー:", error);
                alert("データの取得に失敗しました。");
            } finally {
                // 5. 最後にローディングを終了する
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    // ダッシュボードと同じロジックでアバターURLを生成
    const avatarUrl = name
        ? `https://api.dicebear.com/7.x/shapes/svg?seed=${name}&backgroundColor=0a5b83,1c799f,69d2e7,f1f4dc,f88c49`
        : `https://api.dicebear.com/7.x/shapes/svg?seed=default&backgroundColor=cbd5e1`;

    const handleSave = async () => {
        setIsSaving(true);
        // ここにSupabaseのユーザーメタデータ更新処理を記述
        // await supabase.auth.updateUser({ data: { full_name: name } });

        // シミュレーション用
        setTimeout(() => {
            setIsSaving(false);
            router.push("/"); // 保存後ダッシュボードへ
        }, 1000);
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
                <Loader2 className="animate-spin text-[#2dd4bf]" size={40} />
            </div>
        );
    }

    // 読み込み中、または名前がセットされるまでは、メイン画面を絶対に出さない
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
                <Loader2 className="animate-spin text-[#2dd4bf]" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900">
            {/* ダッシュボードと共通トーンのヘッダー */}
            <header className="bg-[#1e3a8a] text-white shadow-md sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="text-xl font-bold tracking-wider">
                        プロフィール設定
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8">
                        {/* アバターセクション */}
                        <div className="flex flex-col items-center mb-10">
                            <div className="relative group">
                                <div className="h-28 w-28 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-md ring-1 ring-slate-200">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={avatarUrl}
                                        alt="Avatar"
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-[#2dd4bf] text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                                </div>
                            </div>
                            <h2 className="mt-4 font-bold text-slate-800 text-lg">
                                自動生成アバター
                            </h2>
                            <p className="text-sm text-slate-400 text-center mt-1 leading-relaxed">
                                お名前に合わせて
                                <br />
                                独自のアイコンを生成します
                            </p>
                        </div>

                        {/* フォームセクション */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                    お名前{" "}
                                    <span className="text-[#2dd4bf]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="例：山田 太郎"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-[#2dd4bf] focus:ring-4 focus:ring-[#2dd4bf]/10 outline-none transition-all text-slate-800 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 text-opacity-70">
                                    メールアドレス
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="w-full px-4 py-3 bg-slate-100 border border-transparent rounded-xl text-slate-400 cursor-not-allowed text-sm"
                                />
                                <p className="mt-2 text-[11px] text-slate-400 ml-1">
                                    ※ メールアドレスは変更できません。
                                </p>
                            </div>
                        </div>

                        {/* アクションボタン */}
                        <div className="mt-12 flex items-center justify-end gap-4">
                            <button
                                onClick={() => router.back()}
                                className="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-colors cursor-pointer "
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !name}
                                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-[#2dd4bf] hover:bg-[#25b5a3] disabled:bg-slate-200 text-white font-bold shadow-md shadow-[#2dd4bf]/20 transition-all active:scale-95 cursor-pointer "
                            >
                                {isSaving ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={20}
                                    />
                                ) : (
                                    <>
                                        <Check size={20} strokeWidth={3} />
                                        設定を保存
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
