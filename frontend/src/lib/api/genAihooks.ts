import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

// Create a pre-configured axios instance
const api = axios.create({
  baseURL: "", // Set your API base URL if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Centralized error handling function
const handleApiError = (error: any, message: string) => {
  console.error(error);
  toast.error(message);
};

type TranscriptResponse = {
  message: string;
  youtubeUrl: string;
  generatedTranscript: string;
};
type TranscriptInput = { youtubeUrl: string };

export function useGenerateTranscript(
  onSuccess: (data: TranscriptResponse) => void,
  onError?: (error: any) => void
) {
  return useMutation<TranscriptResponse, unknown, TranscriptInput>({
    mutationFn: async (input: TranscriptInput) => {
      try {
        const response = await api.post<TranscriptResponse>(
          "/generate/transcript",
          input
        );
        return response.data;
      } catch (error: any) {
        handleApiError(error, "Failed to generate transcript");
        throw error;
      }
    },
    onSuccess,
    onError,
  });
}

export function useSegmentTranscript(
  onSuccess: (segments: string[]) => void,
  onError?: (error: any) => void
) {
  return useMutation<string[], unknown, { transcript: string }>({
    mutationFn: async ({ transcript }) => {
      try {
        const response = await api.post<string[]>("/generate/transcript/segment", {
          transcript,
        });
        return response.data;
      } catch (error: any) {
        handleApiError(error, "Failed to segment transcript");
        throw error;
      }
    },
    onSuccess,
    onError,
  });
}

type GenerateQuestionsInput = {
  segments: string[];
  questionsPerSegment: number;
};

export function useGenerateQuestions(
  onSuccess: (questions: string[]) => void,
  onError?: (error: any) => void
) {
  return useMutation<string[], unknown, GenerateQuestionsInput>({
    mutationFn: async (input: GenerateQuestionsInput) => {
      try {
        const response = await api.post<string[]>("/generate/questions", input);
        return response.data;
      } catch (error: any) {
        handleApiError(error, "Failed to generate questions");
        throw error;
      }
    },
    onSuccess,
    onError,
  });
}
