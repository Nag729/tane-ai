import { anthropic, MODEL_CONFIG } from "@/lib/anthropic";
import { getFeedbackReviewPrompt } from "@/lib/prompts";
import type { MeetingType, ChatMessage, StructuredOutput } from "@/types";

type FeedbackReviewRequest = {
  type: MeetingType;
  messages: ChatMessage[];
  output: StructuredOutput;
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
        return `ユーザー:\n${answers}`;
      }
    })
    .join("\n\n");
}

function buildUserPrompt(req: FeedbackReviewRequest): string {
  const chatHistory = formatChatHistory(req.messages);

  return `以下は会議資料作成のために行われた対話です：

${chatHistory}

---

この対話を元に生成された会議資料：

${req.output.content}

---

この資料を会議参加者の視点からレビューし、建設的なフィードバックを提供してください。`;
}

export type FeedbackReviewStreamCallbacks = {
  onThinking: (text: string) => void;
  onText: (text: string) => void;
};

export async function streamFeedbackReview(
  req: FeedbackReviewRequest,
  callbacks: FeedbackReviewStreamCallbacks
): Promise<void> {
  const systemPrompt = getFeedbackReviewPrompt(req.type);
  const userPrompt = buildUserPrompt(req);
  const config = MODEL_CONFIG.feedbackReview;

  const messageStream = anthropic.messages.stream({
    model: config.model,
    max_tokens: config.maxTokens,
    thinking: { type: "enabled" as const, budget_tokens: config.thinkingBudget },
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  for await (const event of messageStream) {
    if (event.type === "content_block_delta") {
      if (event.delta.type === "thinking_delta") {
        callbacks.onThinking(event.delta.thinking);
      } else if (event.delta.type === "text_delta") {
        callbacks.onText(event.delta.text);
      }
    }
  }
}
