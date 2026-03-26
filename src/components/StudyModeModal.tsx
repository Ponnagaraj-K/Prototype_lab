import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Timer, BookOpen } from "lucide-react";

interface StudyModeModalProps {
  open: boolean;
  onClose: () => void;
  onSelectTimer: () => void;
  onSelectBook: (bookId: string) => void;
  books: Array<{ _id: string; name: string }>;
}

export const StudyModeModal = ({ open, onClose, onSelectTimer, onSelectBook, books }: StudyModeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Study Mode</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Button
            onClick={onSelectTimer}
            className="w-full h-20 text-lg"
            variant="outline"
          >
            <Timer className="h-6 w-6 mr-2" />
            Use Timer
          </Button>

          <div className="space-y-2">
            <p className="text-sm font-medium">Or select a book:</p>
            {books.map((book) => (
              <Button
                key={book._id}
                onClick={() => onSelectBook(book._id)}
                className="w-full justify-start"
                variant="outline"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {book.name}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
