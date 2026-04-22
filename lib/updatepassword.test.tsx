import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdatePasswordPage from "../app/update-password/page";
import { expect, test, vi } from "vitest";
import { supabase } from "./supabase";
import { AuthError, type User } from "@supabase/supabase-js";

// 1. useRouter のモック
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// 2. supabase.auth.updateUser のモック
vi.mock("./supabase", () => ({
    supabase: {
        auth: {
            updateUser: vi.fn(),
        },
    },
}));

test("新しいパスワードを入力して更新に成功すると、ログイン画面に移動する", async () => {
    // 成功パターンの戻り値を設定
    // 空のオブジェクトではなく、User型としてキャストしたモックデータを使用
    const mockUser = { id: "test-user-id" } as User;

    vi.mocked(supabase.auth.updateUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
    });

    // アラートの監視
    const alertSpy = vi.fn();
    vi.stubGlobal("alert", alertSpy);

    render(<UpdatePasswordPage />);

    // 入力と送信
    const passwordInput = screen.getByPlaceholderText("8文字以上で入力");
    const submitButton = screen.getByRole("button", {
        name: /パスワードを保存する/i,
    });

    fireEvent.change(passwordInput, { target: { value: "new-password-123" } });
    fireEvent.submit(submitButton);

    // 成功アラートが表示されるのを待つ
    await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining("パスワードが更新されました"),
        );
    });

    // ログイン画面へリダイレクトされたか確認
    expect(mockPush).toHaveBeenCalledWith("/login");

    vi.unstubAllGlobals();
});

test("パスワード更新に失敗したときにエラーアラートが表示される", async () => {
    // 失敗パターンの戻り値を設定
    const mockError = new AuthError("更新に失敗しました", 400);

    vi.mocked(supabase.auth.updateUser).mockResolvedValue({
        data: { user: null },
        error: mockError,
    });

    const alertSpy = vi.fn();
    vi.stubGlobal("alert", alertSpy);

    render(<UpdatePasswordPage />);

    const passwordInput = screen.getByPlaceholderText("8文字以上で入力");
    fireEvent.change(passwordInput, { target: { value: "short" } }); // 実際はHTMLのminLengthで弾かれますが、テストではプログラムを通過させます
    fireEvent.submit(passwordInput);

    // エラーメッセージが表示されるのを待つ
    await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining("更新に失敗しました"),
        );
    });

    vi.unstubAllGlobals();
});
