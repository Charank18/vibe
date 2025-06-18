import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface Props {
  initialTranscript: string;
  onSegment: (editedTranscript: string) => void;
  isPending: boolean;
}

export function GeneratorTranscriptEditor({ initialTranscript, onSegment, isPending }: Props) {
  const [editedTranscript, setEditedTranscript] = useState<string>(initialTranscript);

  return (
    <div className="space-y-4">
      <Textarea
        value={editedTranscript}
        onChange={(e) => setEditedTranscript(e.target.value)}
        rows={15}
        disabled={isPending}
        placeholder="Your generated transcript will appear here..."
      />
      <div className="flex justify-end">
        <Button onClick={() => onSegment(editedTranscript)} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Segmenting..." : "Segment Transcript"}
        </Button>
      </div>
    </div>
  );
}