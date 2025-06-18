import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface Props {
  onGenerate: (data: { youtubeUrl?: string; file?: File | null }) => void;
  isPending: boolean;
}

export function GeneratorInputForm({ onGenerate, isPending }: Props) {
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!youtubeUrl && !file) {
      alert('Please provide a YouTube URL or upload a file.');
      return;
    }
    onGenerate({ youtubeUrl, file });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="url"
        placeholder="Enter YouTube URL"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        disabled={isPending || !!file}
      />
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <Input
        type="file"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        disabled={isPending || !!youtubeUrl}
        className="file:text-primary file:font-medium"
      />
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? "Processing..." : "Generate Transcript"}
      </Button>
    </form>
  );
}