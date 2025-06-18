import { useState } from "react";
import { toast } from "sonner";
import { useGenerateQuestions, useGenerateTranscript, useSegmentTranscript } from "@/lib/api/hooks";

// Import the UI components we will create for each step
import { GeneratorInputForm } from "@/ai-components/generator-input-form";
import { GeneratorTranscriptEditor } from "@/ai-components/generator-transcript-editor";
import { GeneratorSegmentDisplay } from "@/ai-components/generator-segment-display";
import { GeneratorOutputPreview } from "@/ai-components/generator-output-preview";

// Import UI Primitives from shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function GenAIHomePage() {
  // State to hold the data as it flows through the generation steps
  const [transcript, setTranscript] = useState<string>('');
  const [segments, setSegments] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);

  // --- TanStack Query Hooks for API Mutations ---

  // Hook for Step 1: Generate Transcript
  const { mutate: generateTranscript, isPending: isTranscriptPending } = useGenerateTranscript(
    (data) => {
      toast.success("Transcript generated successfully!");
      setTranscript(data);
      // Reset subsequent steps
      setSegments([]);
      setQuestions([]);
    }
  );

  // Hook for Step 2: Segment Transcript
  const { mutate: segmentTranscript, isPending: isSegmentPending } = useSegmentTranscript(
    (data) => {
      toast.success("Transcript segmented into " + data.length + " parts!");
      setSegments(data);
    }
  );

  // Hook for Step 3: Generate Questions
  const { mutate: generateQuestions, isPending: isQuestionPending } = useGenerateQuestions(
    (data) => {
      toast.success("Generated " + data.length + " questions!");
      setQuestions(data);
    }
  );

  return (
    // This page will render within your main application layout for teachers
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary">AI Content Generation Suite</h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Create rich course materials like articles and quizzes directly from a video source.
        </p>
      </header>

      <main className="space-y-8">
        {/* --- STEP 1: INPUT --- */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Provide a Video Source</CardTitle>
            <CardDescription>Enter a YouTube URL or upload a media file to begin.</CardDescription>
          </CardHeader>
          <CardContent>
            <GeneratorInputForm 
              onGenerate={generateTranscript} 
              isPending={isTranscriptPending} 
            />
          </CardContent>
        </Card>

        {/* --- STEP 2: TRANSCRIPT & SEGMENTATION --- */}
        {transcript && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Review and Segment Transcript</CardTitle>
              <CardDescription>Correct any transcription errors, then segment the text into logical parts.</CardDescription>
            </CardHeader>
            <CardContent>
              <GeneratorTranscriptEditor
                initialTranscript={transcript}
                onSegment={segmentTranscript}
                isPending={isSegmentPending}
              />
            </CardContent>
          </Card>
        )}

        {/* --- STEP 3: QUESTION GENERATION --- */}
        {segments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Generate Quiz Questions</CardTitle>
              <CardDescription>Use the generated segments to create quiz questions automatically.</CardDescription>
            </CardHeader>
            <CardContent>
              <GeneratorSegmentDisplay
                segments={segments}
                onGenerateQuestions={(qps) => generateQuestions({ segments, questionsPerSegment: qps })}
                isPending={isQuestionPending}
              />
            </CardContent>
          </Card>
        )}
        
        {/* --- STEP 4: PREVIEW & INTEGRATE --- */}
        {questions.length > 0 && (
          <Card>
            <CardHeader>
                <CardTitle>Step 4: Preview & Use Generated Content</CardTitle>
                <CardDescription>Your AI-generated content is ready. You can now use it to create a new course or article.</CardDescription>
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