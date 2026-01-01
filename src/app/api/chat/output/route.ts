import { anthropic, MODEL_ID } from "@/lib/anthropic";
import { getOutputSystemPrompt } from "@/lib/prompts";
import type { HorensoType, ChatMessage } from "@/types";

/**
 * チャット履歴をプロンプト用のテキストに変換
 */
function formatChatHistory(messages: ChatMessage[]): string {
  const questionMap = new Map<string, { content: string; options: Map<string, string> }>();

  messages.forEach((msg) => {
    if (msg.role === "ai") {
      msg.message.questions.forEach((q) => {
        const optionMap = new Map<string, string>();
        q.options.forEach((opt) => optionMap.set(opt.id, opt.label));
        questionMap.set(q.id, { content: q.content, options: optionMap });
      });
    }
  });

  return messages
    .map((msg) => {
      if (msg.role === "ai") {
        const intro = msg.message.intro || "";
        const questions = msg.message.questions
          .map((q) => {
            const options = q.options.map((o) => o.label).join(" / ");
            return `質問: ${q.content}\n  選択肢: [${options}]`;
          })
          .join("\n");
        return `AI: ${intro}\n${questions}`;
      } else {
        const answers = msg.answer.answers
          .map((a) => {
            const question = questionMap.get(a.questionId);
            if (!question) return "";
            const selectedLabels = a.selectedOptionIds
              .map((id) => question.options.get(id) || id)
              .join("、");
            const custom = a.customInput ? ` (補足: ${a.customInput})` : "";
            return `「${question.content}」への回答: ${selectedLabels}${custom}`;
          })
          .filter(Boolean)
          .join("\n");
        const customInput = msg.answer.customInput ? `\n自由入力: ${msg.answer.customInput}` : "";
        return `ユーザー:\n${answers}${customInput}`;
      }
    })
    .join("\n\n");
}

export async function POST(request: Request) {
  const body = await request.json();
  const { type, messages, previousOutput, feedback } = body as {
    type: HorensoType;
    messages: ChatMessage[];
    previousOutput?: { content: string };
    feedback?: string;
  };

  const systemPrompt =
    getOutputSystemPrompt(type) +
    "\n\n# 出力形式\nMarkdown形式で直接出力してください（JSONラッパー不要）。";
  const chatHistory = formatChatHistory(messages);

  let userPrompt: string;
  if (previousOutput && feedback) {
    userPrompt = `これまでの対話:
${chatHistory}

前回の出力:
${previousOutput.content}

ユーザーからのフィードバック:
${feedback}

フィードバックを反映して、改善された文章を生成してください。`;
  } else {
    userPrompt = `これまでの対話:
${chatHistory}

この対話で集まった情報を元に、構造化された文章を生成してください。`;
  }

  const useThinking = !previousOutput; // 再生成時は Extended Thinking 不要

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = anthropic.messages.stream({
          model: MODEL_ID,
          max_tokens: 16000,
          ...(useThinking && {
            thinking: {
              type: "enabled" as const,
              budget_tokens: 8000,
            },
          }),
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        });

        // テキストをリアルタイムでストリーム
        messageStream.on("text", (text) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", text })}\n\n`));
        });

        await messageStream.finalMessage();

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", error: String(error) })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
