import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordPage from "../app/reset-password/page";
import { expect, test, vi } from "vitest";
import { supabase } from "./supabase";
import { AuthError } from "@supabase/supabase-js";

// Supabase の resetPasswordForEmail をモックにする
vi.mock("./supabase", () => ({
    supabase: {
        auth: {
            resetPasswordForEmail: vi.fn(),
        },
    },
}));

test("メールアドレスを入力して送信すると、完了画面に切り替わる", async () => {
    // Supabaseが成功したと仮定する設定
    vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({
        data: {},
        error: null,
    });

    render(<ResetPasswordPage />);

    // 入力フィールドとボタンを見つける
    const emailInput = screen.getByPlaceholderText("name@example.com");
    const submitButton = screen.getByRole("button", {
        name: /再設定リンクを送信する/i,
    });

    // メールアドレスを入力して送信
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.submit(submitButton);

    // 成功メッセージが表示されるのを待つ（画面が切り替わった証拠）
    await waitFor(() => {
        expect(screen.getByText("メールを送信しました")).toBeDefined();
        expect(
            screen.getByText(
                /test@example.com 宛に再設定リンクを送信しました/i,
            ),
        ).toBeDefined();
    });
});

test("送信に失敗したときにアラートが表示される", async () => {
    // Supabaseがエラーを返すと仮定する設定。AuthError 型に準拠したオブジェクトを作成
    const mockError = new AuthError("送信に失敗しました", 400);

    vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({
        data: null,
        error: mockError,
    });

    // アラートを監視
    const alertSpy = vi.fn();
    vi.stubGlobal("alert", alertSpy);

    render(<ResetPasswordPage />);

    const emailInput = screen.getByPlaceholderText("name@example.com");
    fireEvent.change(emailInput, { target: { value: "error@example.com" } });

    // submitButtonを特定してクリックするか、フォーム自体をsubmitします
    fireEvent.submit(emailInput);

    // アラートが出るのを待つ
    await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining("エラーが発生しました"),
        );
    });

    vi.unstubAllGlobals();
});
