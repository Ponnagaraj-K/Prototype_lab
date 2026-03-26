import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, Upload, Trash2, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubjects } from "@/hooks/useSubjects";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from "@/lib/apiClient";

interface Book {
  _id: string;
  name: string;
  url: string;
  uploadedAt: Date;
}

const Books = () => {
  const { user, loading: authLoading } = useAuth();
  const { subjects = [], loading: subjectsLoading } = useSubjects();
  const [books, setBooks] = useState<Record<string, Book[]>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (subjects.length > 0) {
      fetchBooks();
    }
  }, [subjects]);

  const fetchBooks = async () => {
    try {
      const data = await apiClient.get('/books');
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleFileUpload = async (subjectId: string, file: File, inputId: string) => {
    if (!file.type.includes('pdf')) {
      alert('Please upload only PDF files');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('subjectId', subjectId);
      
      console.log('Uploading file:', file.name, 'for subject:', subjectId);
      console.log('FormData entries:', Array.from(formData.entries()));

      const result = await apiClient.post('/books/upload', formData);
      console.log('Upload successful:', result);
      
      await fetchBooks();
      
      // Clear the file input
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input) input.value = '';
    } catch (error) {
      console.error('Error uploading book:', error);
      alert('Failed to upload book');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm('Delete this book?')) return;
    
    try {
      await apiClient.delete(`/books/${bookId}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  if (authLoading || subjectsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!user.setupCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  if (subjects.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container py-6">
          <Card>
            <CardContent className="text-center p-8">
              <h3 className="font-semibold mb-2">No Subjects Found</h3>
              <p className="text-muted-foreground">
                Please complete your academic setup first.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Study Books</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Upload PDF books for each subject (optional)
          </p>
        </div>

        <Tabs defaultValue={subjects[0]?._id} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${subjects.length}, 1fr)` }}>
            {subjects.map((subject: any) => (
              <TabsTrigger key={subject._id} value={subject._id}>
                {subject.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {subjects.map((subject: any) => (
            <TabsContent key={subject._id} value={subject._id}>
              <Card>
                <CardHeader>
                  <CardTitle>{subject.name} Books</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`file-${subject._id}`}>Upload PDF Book</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id={`file-${subject._id}`}
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(subject._id, file, `file-${subject._id}`);
                        }}
                        disabled={uploading}
                      />
                      {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Uploaded Books</h4>
                    {books[subject._id]?.length > 0 ? (
                      books[subject._id].map((book) => (
                        <div
                          key={book._id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-sm">{book.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(book._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No books uploaded yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Books;
