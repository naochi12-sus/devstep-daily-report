import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
    // 1. まずアプリのページを開く（これが必要です！）
    await page.goto("http://localhost:3000/");

    // 2. ログイン画面へ移動
    await page.getByRole("button", { name: "ログイン画面へ" }).click();

    // 3. メールアドレスを入力
    await page
        .getByRole("textbox", { name: "name@example.com" })
        .fill("nao.on.22.my@gmail.com");

    // 4. パスワードを入力
    await page.locator('input[type="password"]').fill("aaaaaaaa");
    // 5. ログインボタンをクリック
    await page
        .getByRole("button", { name: "ダッシュボードへログイン" })
        .click();

    // 6. 日報作成ボタンをクリック
    await page.getByRole("button", { name: "日報作成" }).click();
    await page
        .getByRole("textbox", { name: "例：本日の開発進捗について" })
        .click();
    await page
        .getByRole("textbox", { name: "例：本日の開発進捗について" })
        .fill("test日報");
    await page
        .getByRole("textbox", {
            name: "本日の業務内容や気づきを記入してください",
        })
        .click();
    await page
        .getByRole("textbox", {
            name: "本日の業務内容や気づきを記入してください",
        })
        .fill("TEST");
    page.once("dialog", (dialog) => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
    });
    await page.getByRole("button", { name: "日報を保存する" }).click();
    await expect(page).toHaveURL(/.*reports/);
});
