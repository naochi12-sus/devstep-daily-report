import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../app/login/page";
import { expect, test, vi } from "vitest";
import { supabase } from "./supabase";
import { AuthError, type User, type Session } from "@supabase/supabase-js";

// 1. useRouter のモック
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// 2. supabase.auth.signInWithPassword のモック
// 本物のDBに接続しないように、偽物の関数に置き換えます
vi.mock("./supabase", () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
        },
    },
}));

test("正しくメールアドレスとパスワードを入力してログインできる", async () => {
    // Supabaseの戻り値を「成功（エラーなし）」に設定
    // never を使わず、User型とSession型としてモックデータを作成
    const mockUser = { id: "test-user-id" } as User;
    const mockSession = { access_token: "fake-token" } as Session;

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
    });

    render(<LoginPage />);

    // 入力フィールドを見つける
    const emailInput = screen.getByPlaceholderText("name@example.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const loginButton = screen.getByRole("button", {
        name: /ダッシュボードへログイン/i,
    });

    // 文字を入力する
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // ボタンをクリック
    fireEvent.click(loginButton);

    // Supabaseが正しい情報で呼ばれたか確認
    await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "password123",
        });
    });

    // ログイン成功後にダッシュボードへ移動したか確認
    await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/reports");
    });
});

test("ログインに失敗したときにアラートが表示される", async () => {
    // 1. AuthErrorクラスをnewして作成
    const mockError = new AuthError("認証に失敗しました", 400);

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
    });

    // 2. alertの監視
    const alertSpy = vi.fn();
    vi.stubGlobal("alert", alertSpy);

    render(<LoginPage />);

    // 3. 【修正ポイント】ボタンではなく、入力欄で「Enterキー」を押すか、フォームをsubmitします
    const emailInput = screen.getByPlaceholderText("name@example.com");
    fireEvent.submit(emailInput);

    // 4. 待機（余裕を持って待ちます）
    await waitFor(
        () => {
            expect(alertSpy).toHaveBeenCalled();
        },
        { timeout: 3000 },
    );

    // 5. 内容の確認
    // 「認証に失敗しました」から「ログインに失敗しました」に書き換えます
    await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining("ログインに失敗しました"),
        );
    });

    vi.unstubAllGlobals();
});
