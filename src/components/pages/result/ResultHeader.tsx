import { Card } from "@/components/ui/Card";

export function ResultHeader() {
  return (
    <Card className="text-center">
      <p className="text-4xl mb-2">🎉</p>
      <h1 className="text-2xl font-bold text-stone-800 mb-1">整理完了！</h1>
      <p className="text-stone-600">内容をコピーして使ってね</p>
    </Card>
  );
}
