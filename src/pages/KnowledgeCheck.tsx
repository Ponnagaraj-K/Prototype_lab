import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, BookOpen, Brain, CheckCircle, XCircle, Trophy, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubjects } from "@/hooks/useSubjects";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/apiClient";

interface Book {
  _id: string;
  name: string;
  url: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface TestResult {
  score: number;
  total: number;
  percentage: number;
  answers: { correct: boolean; userAnswer: number; correctAnswer: number }[];
}

const KnowledgeCheck = () => {
  const { user, loading: authLoading } = useAuth();
  const { subjects = [], loading: subjectsLoading } = useSubjects();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [pageFrom, setPageFrom] = useState("");
  const [pageTo, setPageTo] = useState("");
  const [numQuestions, setNumQuestions] = useState("5");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedSubject) {
      fetchBooks(selectedSubject);
    }
  }, [selectedSubject]);

  const fetchBooks = async (subjectId: string) => {
    try {
      const data = await apiClient.get(`/books/subject/${subjectId}`);
      setBooks(data);
      setSelectedBook("");
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleStartTest = async () => {
    setError("");
    
    if (!selectedBook || !pageFrom || !pageTo) {
      setError("Please fill all fields");
      return;
    }

    const from = parseInt(pageFrom);
    const to = parseInt(pageTo);
    const numQ = parseInt(numQuestions);

    if (from > to) {
      setError("'From' page must be less than or equal to 'To' page");
      return;
    }

    if (numQ < 1 || numQ > 20) {
      setError("Number of questions must be between 1 and 20");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/knowledge-check/generate", {
        bookId: selectedBook,
        pageFrom: from,
        pageTo: to,
        numQuestions: numQ,
      });

      setQuestions(response.questions);
      setCurrentQuestion(0);
      setUserAnswers([]);
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (error: any) {
      setError(error.message || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (answers: number[]) => {
    let correct = 0;
    const answerDetails = answers.map((answer, index) => {
      const isCorrect = answer === questions[index].correctAnswer;
      if (isCorrect) correct++;
      return {
        correct: isCorrect,
        userAnswer: answer,
        correctAnswer: questions[index].correctAnswer,
      };
    });

    const percentage = (correct / questions.length) * 100;

    setTestResult({
      score: correct,
      total: questions.length,
      percentage,
      answers: answerDetails,
    });
    setShowResult(true);
  };

  const handleRetake = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setTestResult(null);
    setPageFrom("");
    setPageTo("");
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Outstanding! 🌟 You've mastered this topic!", color: "text-green-600" };
    if (percentage >= 75) return { message: "Great job! 🎉 Keep up the good work!", color: "text-blue-600" };
    if (percentage >= 60) return { message: "Good effort! 📚 Review and try again!", color: "text-yellow-600" };
    return { message: "Keep studying! 💪 Practice makes perfect!", color: "text-red-600" };
  };

  if (authLoading || subjectsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!user.setupCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <AppHeader />
      <main className="container py-8 space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center neon-border">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-display font-bold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Knowledge Check
          </h1>
          <p className="text-gray-700 text-xl">Test your understanding with AI-generated questions</p>
        </motion.div>

        {!questions.length && !showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Setup Your Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Select Subject</Label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full mt-2 p-3 border rounded-xl bg-white/50 backdrop-blur"
                  >
                    <option value="">Choose a subject...</option>
                    {subjects.map((subject: any) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedSubject && (
                  <div>
                    <Label>Select Book</Label>
                    <select
                      value={selectedBook}
                      onChange={(e) => setSelectedBook(e.target.value)}
                      className="w-full mt-2 p-3 border rounded-xl bg-white/50 backdrop-blur"
                    >
                      <option value="">Choose a book...</option>
                      {books.map((book) => (
                        <option key={book._id} value={book._id}>
                          {book.name}
                        </option>
                      ))}
                    </select>
                    {books.length === 0 && (
                      <p className="text-sm text-red-600 mt-2">No books uploaded for this subject</p>
                    )}
                  </div>
                )}

                {selectedBook && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>From Page</Label>
                        <Input
                          type="number"
                          min="1"
                          value={pageFrom}
                          onChange={(e) => setPageFrom(e.target.value)}
                          placeholder="e.g., 1"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>To Page</Label>
                        <Input
                          type="number"
                          min="1"
                          value={pageTo}
                          onChange={(e) => setPageTo(e.target.value)}
                          placeholder="e.g., 10"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Number of Questions</Label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </>
                )}

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleStartTest}
                  disabled={!selectedBook || loading}
                  className="w-full h-14 text-lg btn-gradient text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Start Test
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {questions.length > 0 && !showResult && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Question {currentQuestion + 1} of {questions.length}
                  </CardTitle>
                  <div className="text-sm font-medium text-gray-600">
                    Progress: {Math.round(((currentQuestion) / questions.length) * 100)}%
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    {questions[currentQuestion].question}
                  </p>
                </div>

                <RadioGroup value={selectedAnswer?.toString()} onValueChange={(val) => handleAnswerSelect(parseInt(val))}>
                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedAnswer === index
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300 bg-white/50"
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-medium">
                          {option}
                        </Label>
                      </motion.div>
                    ))}
                  </div>
                </RadioGroup>

                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className="w-full h-14 text-lg btn-gradient text-white"
                >
                  {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Test"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {showResult && testResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <Card className="glass-card text-center">
              <CardContent className="py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 mb-6"
                >
                  <Trophy className="h-12 w-12 text-white" />
                </motion.div>
                <h2 className="text-4xl font-bold mb-4">Test Complete!</h2>
                <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  {testResult.score}/{testResult.total}
                </div>
                <p className="text-2xl text-gray-600 mb-2">{testResult.percentage.toFixed(1)}%</p>
                <p className={`text-xl font-semibold ${getPerformanceMessage(testResult.percentage).color}`}>
                  {getPerformanceMessage(testResult.percentage).message}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Answer Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.map((q, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      testResult.answers[index].correct
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {testResult.answers[index].correct ? (
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 mb-2">{q.question}</p>
                        <p className="text-sm text-gray-600 mb-1">
                          Your answer: <span className={testResult.answers[index].correct ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                            {q.options[testResult.answers[index].userAnswer]}
                          </span>
                        </p>
                        {!testResult.answers[index].correct && (
                          <p className="text-sm text-gray-600 mb-2">
                            Correct answer: <span className="text-green-600 font-medium">
                              {q.options[testResult.answers[index].correctAnswer]}
                            </span>
                          </p>
                        )}
                        <p className="text-sm text-gray-700 mt-2 p-3 bg-white/50 rounded-lg">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={handleRetake} className="flex-1 h-14 text-lg btn-gradient text-white">
                Take Another Test
              </Button>
              <Button onClick={() => window.location.href = '/dashboard'} variant="outline" className="flex-1 h-14 text-lg">
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default KnowledgeCheck;
