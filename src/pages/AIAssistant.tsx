import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, Send, Upload, BookOpen, Youtube, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiClient from "@/lib/apiClient";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  youtubeLinks?: string[];
}

const AIAssistant = () => {
  const { user, loading: authLoading } = useAuth();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasPDF, setHasPDF] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && user.setupCompleted) {
      fetchSubjects();
    }
  }, [user]);

  useEffect(() => {
    if (selectedSubject) {
      checkPDFStatus();
      loadChatHistory();
    }
  }, [selectedSubject]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchSubjects = async () => {
    try {
      const data = await apiClient.get('/subjects');
      setSubjects(data);
      if (data.length > 0) {
        setSelectedSubject(data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const checkPDFStatus = async () => {
    try {
      const response = await apiClient.get(`/books/subject/${selectedSubject}`);
      setHasPDF(response && response.length > 0);
    } catch (error) {
      setHasPDF(false);
    }
  };

  const loadChatHistory = async () => {
    try {
      const data = await apiClient.get(`/ai/chat-history/${selectedSubject}`);
      setMessages(data.messages || []);
    } catch (error) {
      setMessages([]);
    }
  };

  const handleFileUpload = () => {
    // Redirect to books page to upload
    window.location.href = '/books';
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedSubject || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', {
        subjectId: selectedSubject,
        message: input,
        history: messages
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.answer,
        youtubeLinks: response.youtubeLinks || []
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: error.message || 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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

  const selectedSubjectData = subjects.find(s => s._id === selectedSubject);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold">AI Study Assistant</h1>
          <p className="text-muted-foreground text-sm mt-1">Get instant help with your subjects</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm">Select Subject</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedSubject && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium">{selectedSubjectData?.name}</span>
                    </div>
                    <div className={`text-xs ${hasPDF ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {hasPDF ? '✓ PDF Uploaded' : '○ No PDF uploaded'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={handleFileUpload}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {hasPDF ? 'Manage Books' : 'Upload Books'}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Upload books in the Books section to enable AI
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-3">
            <CardContent className="p-0">
              {!selectedSubject ? (
                <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                  Select a subject to start chatting
                </div>
              ) : !hasPDF ? (
                <div className="flex flex-col items-center justify-center h-[600px] text-center p-6">
                  <Lock className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Books to Unlock AI</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload books for {selectedSubjectData?.name} in the Books section to start asking questions
                  </p>
                  <Button onClick={handleFileUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Go to Books
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col h-[600px]">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        <p>Ask me anything about {selectedSubjectData?.name}!</p>
                        <p className="text-sm mt-2">I can help with concepts, problems, and suggest resources.</p>
                      </div>
                    )}
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          {msg.youtubeLinks && msg.youtubeLinks.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs font-semibold flex items-center gap-1">
                                <Youtube className="h-3 w-3" />
                                Recommended Videos:
                              </p>
                              {msg.youtubeLinks.map((link, i) => (
                                <a
                                  key={i}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs underline block hover:opacity-80"
                                >
                                  {link}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask a question..."
                        disabled={loading}
                      />
                      <Button onClick={handleSendMessage} disabled={loading || !input.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;
