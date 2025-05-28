import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

const motivational = {
  betty: "Hi Betty, welcome back! You've made great progress on PolarizEdu.",
  ethan:
    "Hope your vacation went great. Let's start from where you left off last week. You've made a great job learning about making effective conversations.",
};

// Sample question sets for Math/English/Science beginner-friendly
const mathQuestions = [
  {
    question: "What is 2 + 3?",
    img: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=400&q=80",
    choices: ["4", "5", "6"],
    answer: "5",
  },
  {
    question: "What is 7 - 4?",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    choices: ["2", "3", "4"],
    answer: "3",
  },
];

const englishQuestions = [
  {
    question: "Spell the word in the picture.",
    img: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
    answer: "cat",
    hint: "This is a cute animal!",
  },
  {
    question: "Spell the word in the picture.",
    img: "/lovable-uploads/5c0a69c6-3b54-41da-9195-5296461296d4.png",
    answer: "ear",
    hint: "A three-letter word from the word LEARN.",
  },
];

const scienceQuestions = [
  {
    question: "Which part of the plant is shown in this image?",
    img: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&w=400&q=80",
    choices: ["Stem", "Root", "Leaf"],
    answer: "Root",
  },
  {
    question: "What animal is in this picture?",
    img: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?auto=format&fit=crop&w=800&q=80",
    choices: ["Sheep", "Dog", "Cat"],
    answer: "Sheep",
  },
];

// Updated to use a more reliable educational video that allows embedding
const EDUCATIONAL_EMBED_URL = "https://www.youtube.com/embed/hFZFjoX2cGg";

type MathOrScienceQ = { question: string; img: string; choices: string[]; answer: string; };
type EnglishQ = { question: string; img: string; answer: string; hint: string; };
type HomeQuestion = MathOrScienceQ | EnglishQ;

const Home = () => {
  const { user, logout } = useAuth();
  const [showChoices, setShowChoices] = useState(false);
  const [session, setSession] = useState<null | {
    subject: string,
    idx: number
  }>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [input, setInput] = useState("");
  const [showFeedback, setShowFeedback] = useState<null | "correct" | "wrong">(null);
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (!user) return null;

  const welcomeMsg =
    user.username === "betty"
      ? motivational.betty
      : user.username === "ethan"
      ? motivational.ethan
      : `Welcome, ${user.name}!`;

  function handleLearnClick() {
    setShowChoices(true);
    setSession(null);
    setShowFeedback(null);
    setShowVideo(false);
    setInput("");
  }

  function handleChoice(subject: string) {
    setSession({ subject, idx: 0 });
    setShowChoices(false);
    setShowFeedback(null);
    setShowVideo(false);
    setInput("");
  }

  function currentQuestions(): HomeQuestion[] {
    switch (session?.subject) {
      case "Math": return mathQuestions;
      case "English": return englishQuestions;
      case "Science": return scienceQuestions;
      default: return [];
    }
  }

  // Updated: Show embedded educational video, auto-advance after 3 minutes
  function handleShowCocomelon() {
    setShowVideo(true);
    // Set timer to auto-proceed after 3 minutes (180_000 ms)
    timerRef.current = setTimeout(() => {
      setShowVideo(false);
      setShowFeedback(null);
      setInput("");
      onNextQuestion();
    }, 180_000);
  }

  // Clean up timer on unmount or when video closes early
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function onChoiceAnswer(ans: string) {
    if (!session) return;
    const q = currentQuestions()[session.idx] as MathOrScienceQ;
    if ("choices" in q && q.answer.toString().toLowerCase() === ans.toLowerCase()) {
      setShowFeedback("correct");
      setTimeout(() => handleShowCocomelon(), 1000);
    } else {
      setShowFeedback("wrong");
    }
  }

  function onInputAnswerSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    const q = currentQuestions()[session.idx] as EnglishQ;
    if ("answer" in q && q.answer.toString().toLowerCase() === input.trim().toLowerCase()) {
      setShowFeedback("correct");
      setTimeout(() => handleShowCocomelon(), 1000);
    } else {
      setShowFeedback("wrong");
    }
  }

  function onNextQuestion() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!session) return;
    const qlist = currentQuestions();
    if (session.idx + 1 < qlist.length) {
      setSession({ subject: session.subject, idx: session.idx + 1 });
      setShowFeedback(null);
      setShowVideo(false);
      setInput("");
    } else {
      // Finished all questions, show choices again
      setSession(null);
      setShowChoices(true);
      setShowFeedback(null);
      setShowVideo(false);
      setInput("");
    }
  }

  function onQuit() {
    // Reset everything
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setSession(null);
    setShowChoices(true);
    setShowFeedback(null);
    setShowVideo(false);
    setInput("");
  }

  // Main Content Render
  let mainContent;

  if (showChoices || !session) {
    mainContent = (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Our Learning Library
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Welcome {user.name}!
            </p>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">
              {welcomeMsg}
            </p>
            <p className="text-lg text-gray-600 mt-4">
              With interactive lessons and activities, find the best resource for your student.
            </p>
            <Button 
              onClick={handleLearnClick}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full text-lg shadow-lg"
            >
              Dive right in
            </Button>
          </div>

          {/* Subject Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Math Card */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📚</span>
                </div>
                <CardTitle className="text-2xl font-bold text-blue-600">Math</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-6 text-base leading-relaxed">
                  Build strong math foundations with interactive exercises. Practice addition, subtraction, and problem-solving skills through engaging visual problems.
                </CardDescription>
                <Button 
                  onClick={() => handleChoice("Math")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full"
                >
                  Start Math Today
                </Button>
              </CardContent>
            </Card>

            {/* English Card */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <CardTitle className="text-2xl font-bold text-green-600">Worksheets</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-6 text-base leading-relaxed">
                  We've got a worksheet for anything your student is learning! Practice spelling, reading, and vocabulary with fun visual exercises.
                </CardDescription>
                <Button 
                  onClick={() => handleChoice("English")}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full"
                >
                  Check it out
                </Button>
              </CardContent>
            </Card>

            {/* Science Card */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎮</span>
                </div>
                <CardTitle className="text-2xl font-bold text-purple-600">Games</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-6 text-base leading-relaxed">
                  Transform study time into an adventure! Learn about nature, animals, and science through immersive visual identification games.
                </CardDescription>
                <Button 
                  onClick={() => handleChoice("Science")}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-full"
                >
                  Play now
                </Button>
              </CardContent>
            </Card>

            {/* Personalized Card */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✂️</span>
                </div>
                <CardTitle className="text-2xl font-bold text-orange-600">Activities</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-6 text-base leading-relaxed">
                  Our curated activities bring topics to life through hands-on experiments, creative projects, and personalized learning experiences.
                </CardDescription>
                <Button 
                  onClick={() => navigate("/personalized")}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-full"
                >
                  Make something now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } else if (session && showVideo) {
    mainContent = (
      <div className="flex flex-col items-center justify-center w-full gap-4 mt-10">
        <div className="text-xl font-semibold text-blue-800 mb-4">Great job! Enjoy a break with an educational video!</div>
        <div className="text-gray-600">(Your video will end after 3 minutes and the next question will appear.)</div>
        <div className="mt-6 aspect-video w-full max-w-xl rounded-xl overflow-hidden shadow-lg border-4 border-yellow-200 bg-black">
          <iframe
            width="100%"
            height="315"
            src={EDUCATIONAL_EMBED_URL}
            title="Educational Video"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
        <button
          className="mt-6 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded shadow"
          onClick={() => {
            setShowVideo(false);
            setShowFeedback(null);
            setInput("");
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }
            onNextQuestion();
          }}
        >
          Skip Video & Continue
        </button>
        <button
          className="inline-block mt-2 px-4 py-1 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded"
          onClick={onQuit}
        >
          Quit
        </button>
      </div>
    );
  } else if (session) {
    const qlist = currentQuestions();
    const q = qlist[session.idx];
    if (!q) {
      mainContent = (
        <div className="text-center mt-12 text-xl text-gray-700">
          All done! <button onClick={onQuit} className="text-blue-700 underline">Go Back</button>
        </div>
      );
    } else {
      if ("choices" in q) {
        // Math or Science (choose type guard for .choices)
        mainContent = (
          <div className="rounded-xl bg-white/90 shadow-lg p-8 flex flex-col items-center max-w-lg mx-auto mb-6">
            <img
              src={q.img}
              alt="Visual question"
              className="mb-4 w-48 h-48 object-contain rounded-lg"
            />
            <h2 className="font-semibold text-xl text-gray-800 mb-2">{q.question}</h2>
            <div className="flex gap-4 mt-4">
              {q.choices.map((choice: string) => (
                <button
                  key={choice}
                  onClick={() => onChoiceAnswer(choice)}
                  className={`bg-blue-100 hover:bg-yellow-200 px-5 py-2 rounded-lg shadow font-bold ${
                    showFeedback && choice.toString().toLowerCase() === q.answer.toLowerCase() && showFeedback === "correct"
                      ? "bg-green-200"
                      : ""
                  }`}
                  disabled={!!showFeedback}
                >
                  {choice}
                </button>
              ))}
            </div>
            {showFeedback === "correct" && (
              <div className="mt-3 text-green-700 text-lg font-semibold">Correct. Nice work</div>
            )}
            {showFeedback === "wrong" && (
              <div className="mt-3 text-red-700 text-lg font-semibold">
                Wrong, but we can try again
              </div>
            )}
            <div className="flex gap-4 mt-6">
              {showFeedback && showFeedback === "wrong" && (
                <button
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded"
                  onClick={() => setShowFeedback(null)}
                >
                  Retry
                </button>
              )}
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded"
                onClick={onQuit}
              >
                Quit
              </button>
            </div>
          </div>
        );
      } else if ("answer" in q && "hint" in q) {
        // English
        mainContent = (
          <div className="rounded-xl bg-white/90 shadow-lg p-8 flex flex-col items-center max-w-lg mx-auto mb-6">
            <img
              src={q.img}
              alt="Visual spelling"
              className="mb-4 w-64 h-64 object-contain rounded-lg"
            />
            <h2 className="font-semibold text-xl text-gray-800 mb-2">{q.question}</h2>
            <form onSubmit={onInputAnswerSubmit} className="mt-4 flex flex-col items-center gap-2 w-full">
              <input
                placeholder="Type your answer..."
                className="rounded-lg px-4 py-2 border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 text-lg w-48 text-center"
                maxLength={8}
                value={input}
                disabled={!!showFeedback}
                onChange={e => setInput(e.target.value)}
                autoFocus
              />
              <div className="text-gray-500 text-sm mt-1">(Hint: {q.hint})</div>
              <button type="submit" className="mt-3 bg-blue-300 hover:bg-blue-400 text-blue-900 font-bold py-2 px-6 rounded shadow" disabled={!!showFeedback}>
                Submit
              </button>
            </form>
            {showFeedback === "correct" && (
              <div className="mt-3 text-green-700 text-lg font-semibold">Correct. Nice work</div>
            )}
            {showFeedback === "wrong" && (
              <div className="mt-3 text-red-700 text-lg font-semibold">
                Wrong, but we can try again
              </div>
            )}
            <div className="flex gap-4 mt-6">
              {showFeedback && showFeedback === "wrong" && (
                <button
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded"
                  onClick={() => {
                    setShowFeedback(null);
                    setInput("");
                  }}
                >
                  Retry
                </button>
              )}
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded"
                onClick={onQuit}
              >
                Quit
              </button>
            </div>
          </div>
        );
      }
    }
  }

  return (
    <div className="min-h-screen bg-white relative">
      <div className="absolute top-4 right-6 z-10">
        <button
          onClick={logout}
          className="text-sm bg-gray-100 hover:bg-blue-100 px-4 py-2 rounded-lg border shadow text-blue-900 font-semibold"
        >
          Log out
        </button>
      </div>
      {mainContent}
    </div>
  );
};

export default Home;
