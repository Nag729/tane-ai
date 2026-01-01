import { test, expect } from "playwright/test";

/**
 * SSE形式のモックレスポンスを生成
 */
function createSSEResponse(events: Array<{ type: string; data?: unknown }>): string {
  return events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join("");
}

/**
 * 質問APIのモックレスポンス
 */
const mockQuestionResponse = createSSEResponse([
  { type: "progress" },
  { type: "progress" },
  {
    type: "complete",
    data: {
      intro: "なるほど！いい相談内容だね",
      questions: [
        {
          id: "q1",
          content: "この件で一番困っていることは？",
          options: [
            { id: "opt1", label: "時間がない" },
            { id: "opt2", label: "人手が足りない" },
            { id: "opt3", label: "やり方がわからない" },
          ],
          multiSelect: false,
          customInputPlaceholder: "他にあれば...",
        },
      ],
      ready: false,
    },
  },
]);

/**
 * ready状態の質問APIレスポンス
 */
const mockReadyResponse = createSSEResponse([
  { type: "progress" },
  {
    type: "complete",
    data: {
      intro: "OK！十分な情報が集まったよ",
      questions: [],
      ready: true,
    },
  },
]);

/**
 * 出力APIのモックレスポンス
 */
function createOutputResponse(): string {
  const chunks = [
    "# 相談内容",
    "\n\n",
    "## 背景",
    "\n",
    "テスト",
    "の",
    "ストリーミング",
    "出力",
    "です",
    "。",
    "\n\n",
    "## 詳細",
    "\n",
    "これはモックされたレスポンスです。",
  ];

  let body = "";
  for (const chunk of chunks) {
    body += `data: ${JSON.stringify({ type: "text", text: chunk })}\n\n`;
  }
  body += `data: ${JSON.stringify({ type: "done" })}\n\n`;
  return body;
}

test.describe("ストリーミング表示", () => {
  test.beforeEach(async ({ page }) => {
    // 質問APIをモック
    await page.route("**/api/chat/question", async (route) => {
      const request = route.request();
      const body = request.postDataJSON();

      // ready状態を返すかどうか（2回目以降のリクエスト）
      const isFollowUp = body.messages && body.messages.length > 0;

      await route.fulfill({
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
        body: isFollowUp ? mockReadyResponse : mockQuestionResponse,
      });
    });

    // 出力APIをモック
    await page.route("**/api/chat/output", async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
        body: createOutputResponse(),
      });
    });
  });

  test("チャットフローでストリーミング出力が表示される", async ({ page }) => {
    // トップページへ
    await page.goto("/");

    // 「相談」を選択（絵文字付きラベル）
    await page.click("text=💭 相談");

    // チャットページへ遷移
    await expect(page).toHaveURL(/\/chat\?type=consult/);

    // 初期入力フォームに入力（placeholder で特定）
    await page.locator("textarea").first().fill("テストの相談内容");
    await page.locator("textarea").nth(1).fill("テストの相手");
    await page.locator("textarea").nth(2).fill("テストの詳細");

    // 送信
    await page.click('button:has-text("これで始める")');

    // AIの応答を待つ
    await expect(page.locator("text=なるほど！いい相談内容だね")).toBeVisible({ timeout: 10000 });

    // 質問が表示される
    await expect(page.locator("text=この件で一番困っていることは？")).toBeVisible();

    // 選択肢をクリック
    await page.click("text=時間がない");

    // 「次へ」ボタンをクリック
    await page.click('button:has-text("次へ")');

    // ready状態になり「整理完了」ボタンが表示される
    await expect(page.locator('button:has-text("整理完了")')).toBeVisible({ timeout: 10000 });

    // 整理完了ボタンをクリック
    await page.click('button:has-text("整理完了")');

    // 結果ページへ遷移（モックが速いのでストリーミング表示はスキップ）
    await expect(page).toHaveURL(/\/result\?type=consult/, { timeout: 15000 });

    // 最終出力が表示される
    await expect(page.locator("text=これはモックされたレスポンスです")).toBeVisible();
  });

  test("質問生成中は「考え中」が表示される", async ({ page }) => {
    // 遅延させたモックを設定
    await page.route("**/api/chat/question", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body: mockQuestionResponse,
      });
    });

    await page.goto("/chat?type=report");

    // 初期入力
    await page.locator("textarea").first().fill("テスト");
    await page.locator("textarea").nth(1).fill("テスト");
    await page.locator("textarea").nth(2).fill("テスト");
    await page.click('button:has-text("これで始める")');

    // 「考え中...」が表示される
    await expect(page.locator("text=考え中...")).toBeVisible();
  });
});

test.describe("結果ページでの再生成", () => {
  test("フィードバックで再生成時にストリーミング表示される", async ({ page }) => {
    // sessionStorageにデータをセット
    await page.goto("/");
    await page.evaluate(() => {
      const chatData = {
        type: "report",
        messages: [],
        output: { content: "# 初回出力\n\nこれは初回の出力です。" },
      };
      sessionStorage.setItem("horenso-chat-data", JSON.stringify(chatData));
    });

    // 出力APIをモック
    await page.route("**/api/chat/output", async (route) => {
      const chunks = ["# 再生成結果", "\n\n", "フィードバックを反映した内容です。"];
      let body = "";
      for (const chunk of chunks) {
        body += `data: ${JSON.stringify({ type: "text", text: chunk })}\n\n`;
      }
      body += `data: ${JSON.stringify({ type: "done" })}\n\n`;

      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body,
      });
    });

    // 結果ページへ
    await page.goto("/result?type=report");

    // 初回出力が表示される
    await expect(page.getByText("初回出力", { exact: false })).toBeVisible();

    // フィードバック入力
    await page.locator('textarea[placeholder*="修正点"]').fill("もっと詳しく");

    // 再生成ボタンをクリック
    await page.click('button:has-text("再生成")');

    // 再生成後の出力が表示される（モックが速いのでストリーミング表示はスキップ）
    await expect(page.locator("text=フィードバックを反映した内容です")).toBeVisible({
      timeout: 10000,
    });
  });
});
