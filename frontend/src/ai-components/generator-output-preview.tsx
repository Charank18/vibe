import { Button } from "@/components/ui/button";
import { FilePlus2, BookPlus } from "lucide-react";
import { toast } from "sonner";
//import { useRouter } from "next/navigation"; // Or your router hook

interface Props {
  questions: string[];
  articleContent: string;
}

export function GeneratorOutputPreview({ questions, articleContent }: Props) {
  // const router = useRouter(); // Example for Next.js App Router

  const handleCreateCourse = () => {
    // 1. You would make an API call here to your backend to create a new course
    //    with the generated questions and article content.
    // 2. Your backend would return the ID of the new course.
    // 3. You would then navigate the user to the course editor page.
    // router.push(`/teacher/edit-course/${newCourseId}`);

    toast.info("Integration Point: Create New Course", {
      description: "This would navigate to create-course.tsx with the generated content.",
    });
  };
  
  const handleCreateArticle = () => {
    toast.info("Integration Point: Create New Article", {
      description: "This would navigate to create-article.tsx with the transcript.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Generated Quiz Questions</h3>
        <div className="p-4 border rounded-lg bg-muted/50 max-h-72 overflow-y-auto">
          <ul className="space-y-3 list-decimal list-inside text-sm">
            {questions.map((q, index) => (
              <li key={index} className="pl-2">{q}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" onClick={handleCreateArticle}>
          <BookPlus className="mr-2 h-4 w-4" />
          Save as New Article
        </Button>
        <Button onClick={handleCreateCourse}>
          <FilePlus2 className="mr-2 h-4 w-4" />
          Create New Course with this Content
        </Button>
      </div>
    </div>
  );
}