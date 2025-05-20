
import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

type Category = "Math" | "English" | "Science" | "Other";

interface UserQuestion {
  id: string;
  category: Category;
  question: string;
  image: string | null;
  answer: string;
}

const LOCAL_KEY = "polarizedu_personalized";

function getInitial(user: string): UserQuestion[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_KEY}_${user}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQuestions(user: string, data: UserQuestion[]) {
  localStorage.setItem(`${LOCAL_KEY}_${user}`, JSON.stringify(data));
}

const Personalized = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<UserQuestion[]>([]);
  const [category, setCategory] = useState<Category>("Math");
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  // Added for selecting questions and practicing
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [userAttempt, setUserAttempt] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) setQuestions(getInitial(user.username));
  }, [user]);

  if (!user) return null;

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question || !answer) {
      setMessage("Please fill in all fields.");
      return;
    }
    const newQ: UserQuestion = {
      id: Date.now().toString(),
      category,
      question,
      image,
      answer,
    };
    const updated = [newQ, ...questions];
    setQuestions(updated);
    saveQuestions(user.username, updated);
    setCategory("Math");
    setQuestion("");
    setImage(null);
    setAnswer("");
    setMessage("Question saved!");
  }

  // Selection logic
  function toggleSelect(id: string) {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  }

  function handleContinue() {
    if (selectedIds.length > 0) {
      setPracticeMode(true);
      setPracticeIdx(0);
      setUserAttempt("");
      setAttempted(false);
      setLastCorrect(null);
    }
  }

  function handleAttemptSubmit(e: React.FormEvent) {
    e.preventDefault();
    const currentQ = questions.find((q) => q.id === selectedIds[practiceIdx]);
    if (!currentQ) return;
    setAttempted(true);
    setLastCorrect(
      userAttempt.trim().toLowerCase() === currentQ.answer.trim().toLowerCase()
    );
  }

  function handleRetry() {
    setUserAttempt("");
    setAttempted(false);
    setLastCorrect(null);
  }

  function handleNext() {
    if (practiceIdx < selectedIds.length - 1) {
      setPracticeIdx((idx) => idx + 1);
      setUserAttempt("");
      setAttempted(false);
      setLastCorrect(null);
    } else {
      // Done, navigate home
      navigate("/home");
    }
  }

  // Only show selected
  const selectedQuestions = questions.filter((q) => selectedIds.includes(q.id));
  const inPractice = practiceMode && selectedQuestions.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-black px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white/95 rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Your Personalized Questions</h1>
          <button
            onClick={() => navigate("/home")}
            className="bg-gray-100 hover:bg-blue-100 px-4 py-2 rounded-lg border shadow text-blue-900 font-semibold"
          >
            ← Home
          </button>
        </div>
        {!inPractice ? (
          <>
            {/* Add Question Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-blue-50 rounded-xl px-6 py-6 mb-8 shadow flex flex-col gap-4"
            >
              <div>
                <label className="font-semibold text-gray-800 mr-2">Subject</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="rounded-lg px-3 py-2 border bg-white"
                >
                  <option value="Math">Math</option>
                  <option value="English">English</option>
                  <option value="Science">Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-gray-800">Question</label>
                <input
                  className="rounded-lg px-4 py-2 border bg-gray-50 w-full mt-2"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-gray-800">Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="block mt-2" />
                {image && (
                  <img
                    src={image}
                    alt="Question uploaded"
                    className="mt-2 w-32 h-32 object-contain rounded shadow border"
                  />
                )}
              </div>
              <div>
                <label className="font-semibold text-gray-800">Answer</label>
                <input
                  className="rounded-lg px-4 py-2 border bg-gray-50 w-full mt-2"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-yellow-300 hover:bg-yellow-400 text-blue-900 font-bold py-2 px-6 rounded-lg transition-colors shadow"
              >
                Submit
              </button>
              {message && <div className="text-green-700 text-sm mt-2">{message}</div>}
            </form>
            {/* Selectable Questions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Questions to Practice</h2>
              <div className="space-y-3 mb-3">
                {questions.length === 0 && <div className="text-gray-500">No personalized questions yet.</div>}
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className={`border rounded-lg shadow bg-white flex flex-col md:flex-row items-center p-4 gap-4 cursor-pointer  
                    ${selectedIds.includes(q.id) ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => toggleSelect(q.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(q.id)}
                      onChange={() => toggleSelect(q.id)}
                      className="mr-2 scale-125"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mr-4">
                      {q.image ? (
                        <img src={q.image} alt="User visual" className="object-contain w-24 h-24" />
                      ) : (
                        <div className="text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{q.category}</div>
                      <div className="text-gray-800 mb-1">{q.question}</div>
                      <div className="text-gray-500 text-sm">Answer: {q.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold mt-2 disabled:opacity-70"
                disabled={selectedIds.length === 0}
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Practice Mode UI */}
            {selectedQuestions.length > 0 && practiceIdx < selectedQuestions.length && (
              <div className="flex flex-col items-center gap-6">
                <div className="mb-2 w-full max-w-xl border px-6 py-6 rounded-xl bg-white shadow">
                  <div className="font-medium mb-2 text-blue-900">
                    {selectedQuestions[practiceIdx].category}
                  </div>
                  <div className="text-lg mb-1 text-gray-900">{selectedQuestions[practiceIdx].question}</div>
                  {selectedQuestions[practiceIdx].image && (
                    <img
                      src={selectedQuestions[practiceIdx].image}
                      alt="Practice visual"
                      className="my-3 max-h-52 rounded-lg mx-auto border"
                    />
                  )}
                  <form onSubmit={handleAttemptSubmit}>
                    <input
                      className="mt-2 rounded-lg px-4 py-2 border bg-gray-50 w-full max-w-xs"
                      placeholder="Type your answer"
                      value={userAttempt}
                      onChange={(e) => setUserAttempt(e.target.value)}
                      disabled={attempted}
                      required
                    />
                    {!attempted && (
                      <button
                        type="submit"
                        className="ml-3 mt-2 bg-yellow-300 hover:bg-yellow-400 text-blue-900 font-semibold py-2 px-6 rounded-lg shadow"
                      >
                        Submit
                      </button>
                    )}
                  </form>
                  {attempted && (
                    <div className={`mt-4 text-lg font-semibold ${lastCorrect ? "text-green-700" : "text-red-700"}`}>
                      {lastCorrect ? "Correct. Nice work" : "Wrong, But we can try again"}
                    </div>
                  )}
                </div>
                {/* Buttons */}
                {attempted && (
                  <div className="flex gap-4">
                    <button
                      className="bg-blue-100 hover:bg-blue-200 text-blue-900 px-6 py-2 rounded-lg font-semibold shadow"
                      onClick={handleRetry}
                    >
                      Retry
                    </button>
                    <button
                      className="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-semibold shadow"
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  </div>
                )}
                <div className="text-gray-500 text-sm mt-2">
                  Question {practiceIdx + 1} of {selectedQuestions.length}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Personalized;
