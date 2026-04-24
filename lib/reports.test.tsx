import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../app/reports/page"; // パスが正しいか確認してください
import { expect, test, vi, beforeEach } from "vitest";
import { supabase } from "./supabase";
import type { User, PostgrestResponse } from "@supabase/supabase-js";

// --- 1. 型の定義 ---

// 日報データの構造
interface ReportData {
    id: string;
    title: string;
    category: string;
    users: { name: string };
}

// 複雑なチェーンメソッドを型安全に扱うためのモック用型
// PostgrestFilterBuilderの代わりに「同じ構造を持つ型」を自作します
interface PostgrestMock {
    select: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    range: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    or: ReturnType<typeof vi.fn>;
    gte: ReturnType<typeof vi.fn>;
    lte: ReturnType<typeof vi.fn>;
}

// --- 2. モックの設定 ---
// useRouter の偽物（モック）を作成
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    }),
}));

// --- 最強の偽物データベース（モック）を定義 ---
// これを定義することで、どんな命令が来ても「はい、わかりました」と答えられるようになります
const mockQuery: PostgrestMock = {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
};

vi.mock("./supabase", () => ({
    supabase: {
        auth: {
            getUser: vi.fn(),
            signOut: vi.fn(),
        },
        from: vi.fn(() => mockQuery), // 常に最強の偽物を返す
    },
}));

beforeEach(() => {
    vi.clearAllMocks();
    // デフォルトの戻り値を設定しておく（空の成功レスポンス）
    mockQuery.range.mockResolvedValue({
        data: [],
        count: 0,
        error: null,
        status: 200,
        statusText: "OK",
    });

    // ログインユーザーのモック（既存のコード）
    const mockUser = {
        id: "user-123",
        user_metadata: { full_name: "テスト太郎" },
    } as unknown as User;

    vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
    });
});
// --- 3. テストケース ---

test("日報が正しく一覧表示される", async () => {
    // PostgrestResponse に具体的な型 ReportData[] を渡す
    const mockResponse: PostgrestResponse<ReportData> = {
        data: [
            {
                id: "1",
                title: "テスト日報",
                category: "dev",
                users: { name: "テスト太郎" },
            },
        ],
        count: 1,
        error: null,
        status: 200,
        statusText: "OK",
    };

    // mockResolvedValue に渡す際も型が一致するのでスムーズです
    vi.mocked(mockQuery.range).mockResolvedValue(mockResponse);

    render(<Home />);

    // デバッグ用：今の画面に何が映っているか、GitHub Actionsのログに出力する
    // screen.debug();

    // もし「テスト太郎」が見つからないなら、代わりに
    // 「日報がまだありません」という文字が出ていないか確認する
    const emptyMessage = screen.queryByText(/日報がまだありません/i);
    if (emptyMessage) {
        console.log("データが0件として処理されています");
    }

    const userElement = await screen.findByText(
        "テスト太郎",
        {},
        { timeout: 8000 },
    ); // 少し長めに待つ
    expect(userElement).toBeDefined();
});

test("「今日」のフィルターボタンを押すと、日付絞り込みが行われる", async () => {
    render(<Home />);
    // 修正ポイント：まずデータが出るまで待つ
    await screen.findByText("テスト太郎", {}, { timeout: 5000 });

    const todayButton = screen.getByRole("button", { name: "今日" });
    fireEvent.click(todayButton);

    await waitFor(() => {
        expect(mockQuery.gte).toHaveBeenCalled();
    });
});

test("「次のページ」ボタンを押すと、ページが切り替わる", async () => {
    // PostgrestResponse<ReportData> 型として定義
    const mockResponse: PostgrestResponse<ReportData> = {
        data: [
            {
                id: "1",
                title: "日報1",
                category: "dev",
                users: { name: "テスト太郎" },
            },
            // ...データの中身は何でもいいので、最低1つは入れる
        ],
        count: 15,
        error: null,
        status: 200,
        statusText: "OK",
    };

    vi.mocked(mockQuery.range).mockResolvedValue(mockResponse);

    render(<Home />);

    // 2. 【ここが一番重要！】
    // 「日報がまだありません」という文字が消えるまで待つ、
    // もしくは「日報1」というデータが表示されるまで待ちます。
    // これで、アプリが「あ、データがあるんだ！」と認識したことを確認できます。
    await waitFor(
        () => {
            expect(screen.queryByText(/日報がまだありません/i)).toBeNull();
        },
        { timeout: 4000 },
    );

    // 3. 画面が書き換わった後に、ボタンを探す
    // findByText は「表示されるまで最大数秒間、粘り強く待つ」コマンドです
    const nextButton = await screen.findByText(/次のページ/i);

    // 4. ボタンをクリック
    fireEvent.click(nextButton);

    // 5. ページ番号が「2 / 3」に変わるのを確認
    await waitFor(() => {
        expect(screen.getByText(/2 \/ 3/)).toBeDefined();
    });
});
