import { defineConfig, devices } from "@playwright/test";

/**
 * Playwrightの設定ファイル
 * アプリをどう起動し、どれくらい待つかを決める「指示書」です。
 */
export default defineConfig({
    // テスト全体の制限時間。GitHub Actionsはのんびり動くので、60秒に延ばしています。
    timeout: 60 * 1000,
    expect: {
        // 「ボタンが出るまで待つ」などの判定にかける時間。10秒に設定。
        timeout: 10000,
    },

    testDir: "./tests",
    /* 並列実行（複数のテストを同時に走らせる設定） */
    fullyParallel: true,
    /* 本番環境（CI）では、誤って特定のテストだけ実行する設定を残さないようにする */
    forbidOnly: !!process.env.CI,
    /* 失敗したときに自動でやり直す回数。CIでは2回まで粘ります */
    retries: process.env.CI ? 2 : 0,
    /* CIでは同時に動かす人数を1人に制限して、サーバーのパンクを防ぎます */
    workers: process.env.CI ? 1 : undefined,
    /* テスト結果のレポート形式 */
    reporter: "html",

    use: {
        /* 基準となるURL */
        baseURL: "http://localhost:3000",
        /* 失敗した時だけ、証拠写真（トレース）を保存する */
        trace: "on-first-retry",
    },

    /* どのブラウザでテストするか。基本の3つをセットしています */
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
        },
    ],

    /**
     * ここが一番重要！
     * テストを始める前に「アプリを起動させる」設定です。
     */
    webServer: {
        // 【修正点】npm run dev ではなく npm run start を使います。
        // GitHub Actions（本番ビルド環境）では start の方が圧倒的に安定します。
        command: "cd .. && npm run start",

        url: "http://localhost:3000",

        // ローカル開発中は既に起動してればそれを使いますが、CIでは毎回新しく起動します
        reuseExistingServer: !process.env.CI,

        stdout: "ignore",
        stderr: "pipe",

        // 【修正点】起動を待つ時間を「180秒（3分）」に延ばしました。
        // ビルド直後の起動は時間がかかるため、余裕を持たせています。
        timeout: 180 * 1000,
    },
});
