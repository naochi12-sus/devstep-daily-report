import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../app/reports/page"; // パスが正しいか確認してください
import { expect, test, vi, beforeEach } from "vitest";
import { supabase } from "./supabase";

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
const mockQuery = {
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
    // ログイン済みとして設定
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { user: { user_metadata: { full_name: "テスト太郎" } } as any },
        error: null,
    });
});

// --- 2. 各テストケース ---

test("日報が正しく一覧表示される", async () => {
    vi.mocked(mockQuery.range).mockResolvedValue({
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(<Home />);
    await waitFor(() =>
        expect(screen.getAllByText("テスト太郎")[0]).toBeDefined(),
    );
});

test("「今日」のフィルターボタンを押すと、日付絞り込みが行われる", async () => {
    render(<Home />);
    await waitFor(() =>
        expect(screen.getAllByText("テスト太郎")[0]).toBeDefined(),
    );

    const todayButton = screen.getByRole("button", { name: "今日" });
    fireEvent.click(todayButton);

    await waitFor(() => {
        expect(mockQuery.gte).toHaveBeenCalled();
    });
});

test("「次のページ」ボタンを押すと、ページが切り替わる", async () => {
    // 1. 15件あるという設定にする
    vi.mocked(mockQuery.range).mockResolvedValue({
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

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
