import { render, screen, fireEvent } from "@testing-library/react"; // 👈 fireEvent を追加
import WelcomePage from "../app/page";
import { expect, test, vi } from "vitest";

// useRouterの偽物（モック）を作る
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush, // 👈 どこへ移動しようとしたか記録できるようにする
    }),
}));

test("ログインボタンをクリックするとログイン画面に遷移しようとすること", () => {
    render(<WelcomePage />);

    // 1. 「ログイン画面へ」というテキストがあるボタンを探す
    const loginButton = screen.getByText("ログイン画面へ");

    // 2. そのボタンをクリックする！
    fireEvent.click(loginButton);

    // 3. 検証：router.push("/login") が呼ばれたか確認する
    expect(mockPush).toHaveBeenCalledWith("/login");
});

test("新規登録ボタンをクリックするとサインアップ画面に遷移しようとすること", () => {
    render(<WelcomePage />);

    // 「はじめてご利用ですか？」というテキストの周辺にあるボタンをより正確に探す
    // もしボタン自体のテキストが「新規登録」なら、そちらを優先します
    const signupButton = screen.getByRole("button", {
        name: /今すぐアカウントを作成する/i,
    });

    // もし上記でエラーが出る場合は、一旦こちらを試してください：
    // const signupButton = screen.getByText('はじめてご利用ですか？').closest('div')?.querySelector('button');

    if (signupButton) {
        fireEvent.click(signupButton);
    }

    // /signup に行こうとしたか確認
    expect(mockPush).toHaveBeenCalledWith("/signup");
});
