import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateReportScreen from "../app/reports/new/page"; // パスは適宜調整してください
import { expect, test, vi, beforeEach } from "vitest";
import { supabase } from "./supabase";

// 1. 各種モックの設定
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
        replace: vi.fn(),
        back: vi.fn(),
    }),
}));

vi.mock("./supabase", () => ({
    supabase: {
        auth: {
            getUser: vi.fn(),
            signOut: vi.fn(),
        },
        from: vi.fn(() => ({
            insert: vi.fn().mockReturnThis(),
        })),
    },
}));

beforeEach(() => {
    vi.clearAllMocks();
    // 認証チェックをパスするようにデフォルト設定
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: {
            user: {
                id: "user-123",
                user_metadata: { full_name: "テスト太郎" },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any,
        },
        error: null,
    });
});

test("正しく入力して保存すると、成功アラートが出て一覧画面へ移動する", async () => {
    // Supabaseへの保存成功をモック
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(supabase.from).mockReturnValue({ insert: mockInsert } as any);

    const alertSpy = vi.fn();
    vi.stubGlobal("alert", alertSpy);

    render(<CreateReportScreen />);

    // 認証チェック（useEffect）が終わって画面が出るまで待つ
    await waitFor(() => {
        expect(screen.getByText("日報作成画面")).toBeDefined();
    });

    // 入力フォームを埋める
    const titleInput = screen.getByPlaceholderText(/本日の開発進捗/i);
    const contentInput = screen.getByPlaceholderText(/本日の業務内容/i);
    const submitButton = screen.getByRole("button", {
        name: /日報を保存する/i,
    });

    fireEvent.change(titleInput, { target: { value: "テストタイトル" } });
    fireEvent.change(contentInput, { target: { value: "テスト本文です" } });

    fireEvent.submit(submitButton);

    // 保存処理が呼ばれたか、アラートが出たか確認
    await waitFor(() => {
        expect(mockInsert).toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledWith("日報を保存しました！");
        expect(mockPush).toHaveBeenCalledWith("/reports");
    });
});

test("タイトルが空の場合、バリデーションエラーが表示される", async () => {
    render(<CreateReportScreen />);

    await waitFor(() => {
        expect(screen.getByText("日報作成画面")).toBeDefined();
    });

    const submitButton = screen.getByRole("button", {
        name: /日報を保存する/i,
    });
    fireEvent.submit(submitButton);

    // エラーメッセージが表示されるか確認
    await waitFor(() => {
        expect(screen.getByText("タイトルを入力してください。")).toBeDefined();
    });
});
// 既存のテストの下に追加してください

test("ログアウトボタンを押すと、確認ダイアログが出てログイン画面へ戻る", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    const signOutSpy = vi
        .mocked(supabase.auth.signOut)
        .mockResolvedValue({ error: null });

    render(<CreateReportScreen />);
    await waitFor(() => expect(screen.getByText("日報作成画面")).toBeDefined());

    // ログアウトボタン（LucideのLogOutアイコンが入っているボタン）を探してクリック
    const logoutButton = screen.getByTitle("ログアウト");
    fireEvent.click(logoutButton);

    expect(confirmSpy).toHaveBeenCalledWith("ログアウトしますか？");
    await waitFor(() => {
        expect(signOutSpy).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith("/login");
    });

    confirmSpy.mockRestore();
});

test("文字数制限（50文字）を超えるとエラーが表示される", async () => {
    render(<CreateReportScreen />);
    await waitFor(() => expect(screen.getByText("日報作成画面")).toBeDefined());

    const titleInput = screen.getByPlaceholderText(/本日の開発進捗/i);
    // 51文字入力してみる
    fireEvent.change(titleInput, { target: { value: "a".repeat(51) } });

    const submitButton = screen.getByRole("button", {
        name: /日報を保存する/i,
    });
    fireEvent.submit(submitButton);

    await waitFor(() => {
        expect(
            screen.getByText("タイトルは50文字以内で入力してください。"),
        ).toBeDefined();
    });
});
// 既存のテストの下に追加

test("保存中にサーバーエラーが発生した場合、エラーメッセージが表示される", async () => {
    // 1. 保存（insert）が失敗するようにモックを設定
    const mockInsert = vi.fn().mockResolvedValue({
        error: { message: "データベースエラーが発生しました" },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(supabase.from).mockReturnValue({ insert: mockInsert } as any);

    const alertSpy = vi.fn();
    vi.stubGlobal("alert", alertSpy);

    render(<CreateReportScreen />);
    await waitFor(() => expect(screen.getByText("日報作成画面")).toBeDefined());

    // 入力して送信
    fireEvent.change(screen.getByPlaceholderText(/本日の開発進捗/i), {
        target: { value: "タイトル" },
    });
    fireEvent.change(screen.getByPlaceholderText(/本日の業務内容/i), {
        target: { value: "本文" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /日報を保存する/i }));

    // エラーアラートが出るか確認
    await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining("予期せぬエラー"),
        );
    });

    vi.unstubAllGlobals();
});

test("業務内容が長すぎる場合にエラーが表示される", async () => {
    render(<CreateReportScreen />);
    await waitFor(() => expect(screen.getByText("日報作成画面")).toBeDefined());

    const contentInput = screen.getByPlaceholderText(/本日の業務内容/i);
    // 2001文字入力してみる
    fireEvent.change(contentInput, { target: { value: "a".repeat(2001) } });

    fireEvent.submit(screen.getByRole("button", { name: /日報を保存する/i }));

    await waitFor(() => {
        expect(
            screen.getByText("業務内容は2000文字以内で入力してください。"),
        ).toBeDefined();
    });
});
