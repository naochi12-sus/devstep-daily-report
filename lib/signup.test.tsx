import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupPage from "../app/signup/page";
import { expect, test, vi } from "vitest";
import { supabase } from "./supabase";
import { AuthError, User } from "@supabase/supabase-js";

// 1. useRouter のモック
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// 2. supabase.auth.signUp のモック
vi.mock("./supabase", () => ({
    supabase: {
        auth: {
            signUp: vi.fn(),
        },
    },
}));

test("すべての項目を入力して登録に成功すると、ログイン画面に移動する", async () => {
    // 成功時の戻り値を型安全に定義
    // Userオブジェクトを作成
    const mockUser = {
        id: "test-user-id",
        email: "signup@example.com",
    } as User;

    vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
    });

    // アラートの監視
    const alertSpy = vi.fn();
    vi.stubGlobal("alert", alertSpy);

    render(<SignupPage />);

    // 入力フィールドを見つける
    const nameInput = screen.getByPlaceholderText("山田 太郎");
    const emailInput = screen.getByPlaceholderText("name@example.com");
    const passwordInput = screen.getByPlaceholderText("8文字以上で入力");
    const submitButton = screen.getByRole("button", {
        name: /アカウントを作成する/i,
    });

    // 情報を入力
    fireEvent.change(nameInput, { target: { value: "テスト ユーザー" } });
    fireEvent.change(emailInput, { target: { value: "signup@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // 送信
    fireEvent.submit(submitButton);

    // 3. Supabaseが「名前付き」で呼ばれたか確認
    await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
            email: "signup@example.com",
            password: "password123",
            options: {
                data: {
                    full_name: "テスト ユーザー",
                },
            },
        });
    });

    // 成功アラートと遷移の確認
    await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining("登録が完了しました"),
        );
        expect(mockPush).toHaveBeenCalledWith("/login");
    });

    vi.unstubAllGlobals();
});

test("登録に失敗したときにエラーアラートが表示される", async () => {
    // 失敗時の戻り値を設定
    const mockError = new AuthError(
        "既に登録されているメールアドレスです",
        400,
    );

    vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError, // これで型エラーが消えます
    });

    const alertSpy = vi.fn();
    vi.stubGlobal("alert", alertSpy);

    render(<SignupPage />);

    const submitButton = screen.getByRole("button", {
        name: /アカウントを作成する/i,
    });
    fireEvent.submit(submitButton);

    // エラーアラートを待つ
    await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining("登録に失敗しました"),
        );
    });

    vi.unstubAllGlobals();
});
