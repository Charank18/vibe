import { useState } from "react";
import { toast } from "sonner";
import { useGenerateTranscript } from "@/lib/api/genAihooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function TranscriptFromVideo() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>("");

  const { mutate: generateTranscript, isPending } = useGenerateTranscript(
    (data) => {
      toast.success("Transcript generated successfully!");
      setTranscript(data.generatedTranscript);
    },
    (error) => {
      toast.error("Failed to generate transcript.");
      console.error(error);
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      toast.warning("Please select a video file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", videoFile);
    generateTranscript(formData as any); // Your hook must accept FormData
  };

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Generate Transcript from Video File</CardTitle>
          <CardDescription>Upload a video file to get an AI-generated transcript.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              disabled={isPending}
              required
            />
            <Button type="submit" disabled={isPending || !videoFile}>
              {isPending ? "Generating..." : "Generate Transcript"}
            </Button>
          </form>
          {transcript && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Transcript:</h3>
              <Textarea value={transcript} readOnly rows={12} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
