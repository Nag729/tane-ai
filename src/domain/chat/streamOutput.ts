import { anthropic, MODEL_ID } from "@/lib/anthropic";
import { getOutputSystemPrompt } from "@/lib/prompts";
import type { HorensoType, ChatMessage } from "@/types";

type OutputRequest = {
  type: HorensoType;
  messages: ChatMessage[];
  previousOutput?: { content: string };
  feedback?: string;
};

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

function buildUserPrompt(req: OutputRequest): string {
  const chatHistory = formatChatHistory(req.messages);

  if (req.previousOutput && req.feedback) {
    return `これまでの対話:
${chatHistory}

前回の出力:
${req.previousOutput.content}

ユーザーからのフィードバック:
${req.feedback}

フィードバックを反映して、改善された文章を生成してください。`;
  }

  return `これまでの対話:
${chatHistory}

この対話で集まった情報を元に、構造化された文章を生成してください。`;
}

export type OutputStreamCallbacks = {
  onThinkingStart: () => void;
  onThinking: (text: string) => void;
  onTextStart: () => void;
  onText: (text: string) => void;
  onBlockStop: () => void;
};

export async function streamOutput(
  req: OutputRequest,
  callbacks: OutputStreamCallbacks
): Promise<void> {
  const systemPrompt =
    getOutputSystemPrompt(req.type) +
    "\n\n# 出力形式\nMarkdown形式で直接出力してください（JSONラッパー不要）。";
  const userPrompt = buildUserPrompt(req);
  const useThinking = !req.feedback;

  const messageStream = anthropic.messages.stream({
    model: MODEL_ID,
    max_tokens: 16000,
    ...(useThinking && { thinking: { type: "enabled" as const, budget_tokens: 8000 } }),
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  for await (const event of messageStream) {
    if (event.type === "content_block_start") {
      if (event.content_block.type === "thinking") {
        callbacks.onThinkingStart();
      } else if (event.content_block.type === "text") {
        callbacks.onTextStart();
      }
    } else if (event.type === "content_block_delta") {
      if (event.delta.type === "thinking_delta") {
        callbacks.onThinking(event.delta.thinking);
      } else if (event.delta.type === "text_delta") {
        callbacks.onText(event.delta.text);
      }
    } else if (event.type === "content_block_stop") {
      callbacks.onBlockStop();
    }
  }
}
