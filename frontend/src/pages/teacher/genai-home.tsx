import { useState } from "react";
import { toast } from "sonner";
import {
  useGenerateQuestions,
  useGenerateTranscript,
  useSegmentTranscript
} from "@/lib/api/genAihooks";

// Component imports
import { GeneratorInputForm } from "@/ai-components/generator-input-form";
import { GeneratorTranscriptEditor } from "@/ai-components/generator-transcript-editor";
import { GeneratorSegmentDisplay } from "@/ai-components/generator-segment-display";
import { GeneratorOutputPreview } from "@/ai-components/generator-output-preview";

// UI Primitives
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

export default function GenAIHomePage() {
  const [transcript, setTranscript] = useState<string>('');
  const [segments, setSegments] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);

  const { mutate: generateTranscript, isPending: isTranscriptPending } = useGenerateTranscript(
    (data) => {
      toast.success("Transcript generated successfully!");
      setTranscript(data.generatedTranscript);
      setSegments([]);
      setQuestions([]);
    },
    (error) => {
      toast.error("Failed to generate transcript");
    }
  );

  const { mutate: segmentTranscript, isPending: isSegmentPending } = useSegmentTranscript(
    (data) => {
      toast.success(`Transcript segmented into ${data.length} parts!`);
      setSegments(data);
    }
  );

  const { mutate: generateQuestions, isPending: isQuestionPending } = useGenerateQuestions(
    (data) => {
      toast.success(`Generated ${data.length} questions!`);
      setQuestions(data);
    }
  );

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary">AI Content Generation Suite</h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Create rich course materials like articles and quizzes directly from a video source.
        </p>
      </header>

      <main className="space-y-8">
        {/* Step 1 */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Provide a Video Source</CardTitle>
            <CardDescription>Enter a YouTube URL or upload a video file to begin transcription.</CardDescription>
          </CardHeader>
          <CardContent>
            <GeneratorInputForm
              isPending={isTranscriptPending}
              onGenerate={(input) => {
                if (input.file) {
                  const formData = new FormData();
                  formData.append("file", input.file);
                  generateTranscript(formData as any);
                } else if (input.youtubeUrl) {
                  generateTranscript({ youtubeUrl: input.youtubeUrl });
                }
              }}
            />  
          </CardContent>
        </Card>

        {/* Step 2 */}
        {transcript && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Review and Segment Transcript</CardTitle>
              <CardDescription>Correct any transcription errors, then segment the text into logical parts.</CardDescription>
            </CardHeader>
            <CardContent>
              <GeneratorTranscriptEditor
                initialTranscript={transcript}
                onSegment={(editedTranscript) => segmentTranscript({ transcript: editedTranscript })}
                isPending={isSegmentPending}
              />
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
        {segments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Generate Quiz Questions</CardTitle>
              <CardDescription>Use the generated segments to create quiz questions automatically.</CardDescription>
            </CardHeader>
            <CardContent>
              <GeneratorSegmentDisplay
                segments={segments}
                onGenerateQuestions={(qps) =>
                  generateQuestions({ segments, questionsPerSegment: qps })
                }
                isPending={isQuestionPending}
              />
            </CardContent>
          </Card>
        )}

        {/* Step 4 */}
        {questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Preview & Use Generated Content</CardTitle>
              <CardDescription>Your AI-generated content is ready for use in a course or article.</CardDescription>
            </CardHeader>
            <CardContent>
              <GeneratorOutputPreview
                questions={questions}
                articleContent={transcript}
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
