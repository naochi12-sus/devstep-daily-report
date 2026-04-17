"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, LogIn } from "lucide-react"; // 全てのアイコンをここで定義

export default function WelcomePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-linear-to-br from-[#1e3a8a] to-[#1e40af] flex flex-col items-center justify-center text-white px-6 font-sans">
            {/* ロゴ・タイトルエリア */}
            <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
                    <span className="text-4xl font-black italic">T</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                    Team Activity Log
                </h1>
                <p className="text-lg text-blue-100 max-w-md mx-auto leading-relaxed opacity-90">
                    チームの日報をスマートに管理。
                    共有・コメント・可視化をこれひとつで。
                </p>
            </div>

            {/* ボタンエリア */}
            <div className="flex flex-col gap-4 w-full max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/*  ログインボタン */}
                <button
                    onClick={() => router.push("/login")}
                    className="group bg-[#2dd4bf] hover:bg-[#25b5a3] text-[#1e3a8a] font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-[#2dd4bf]/20 active:scale-95 cursor-pointer "
                >
                    <LogIn size={20} />
                    ログイン画面へ
                    <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                    />
                </button>

                {/* アカウントがない人向けの補足テキストリンク */}
                <div className="text-center mt-6 py-4 border-t border-white/10">
                    <p className="text-sm text-blue-100/60 mb-2">
                        はじめてご利用ですか？
                    </p>
                    <button
                        onClick={() => router.push("/signup")}
                        className="text-sm font-bold text-[#2dd4bf] hover:text-white transition-colors flex items-center justify-center mx-auto gap-1 group cursor-pointer "
                    >
                        今すぐアカウントを作成する
                        <ArrowRight
                            size={14}
                            className="group-hover:translate-x-0.5 transition-transform"
                        />
                    </button>
                </div>
            </div>

            {/* フッター */}
            <footer className="absolute bottom-8 text-blue-200/30 text-[10px] font-bold tracking-widest uppercase">
                © 2026 Team Activity Log
            </footer>
        </div>
    );
}
