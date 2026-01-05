import { Sprout } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function ResultHeader() {
  return (
    <Card className="text-center">
      <div className="flex justify-center mb-2">
        <Sprout className="text-emerald-500" size={48} />
      </div>
      <h1 className="text-2xl font-bold text-stone-800 mb-1">資料完成！</h1>
      <p className="text-stone-600">会議の準備が整いました。コピーして共有してね</p>
    </Card>
  );
}
