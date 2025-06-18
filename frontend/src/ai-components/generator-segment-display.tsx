import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Props {
  segments: string[];
  onGenerateQuestions: (questionsPerSegment: number) => void;
  isPending: boolean;
}

export function GeneratorSegmentDisplay({ segments, onGenerateQuestions, isPending }: Props) {
  const [qps, setQps] = useState<number>(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-1">
        {segments.map((segment, index) => (
          <Card key={index} className="bg-muted">
            <CardContent className="p-4 text-sm text-muted-foreground">{segment}</CardContent>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
        <label htmlFor="qps" className="font-medium whitespace-nowrap text-sm">Questions per Segment:</label>
        <Input
          type="number"
          id="qps"
          min="1" max="5"
          value={qps}
          onChange={(e) => setQps(Number(e.target.value))}
          disabled={isPending}
          className="w-20"
        />
        <Button onClick={() => onGenerateQuestions(qps)} disabled={isPending} className="ml-auto">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Generating..." : "Generate Questions"}
        </Button>
      </div>
    </div>
  );
}