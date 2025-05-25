
import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

const motivational = {
  betty: "Hi Betty, welcome back! You’ve made great progress on PolarizEdu.",
  ethan:
    "Hope your vacation went great. Let’s start from where you left off last week. You’ve made a great job learning about making effective conversations.",
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

const COCOMELON_VIDEO = "https://www.youtube.com/embed/z3-Oy8dpV-A?autoplay=1&controls=1";

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
  const [correct, setCorrect] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [input, setInput] = useState("");
  const [showFeedback, setShowFeedback] = useState<null | "correct" | "wrong">(null);
  const navigate = useNavigate();

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
    setCorrect(false);
    setShowVideo(false);
    setInput("");
  }

  function handleChoice(subject: string) {
    setSession({ subject, idx: 0 });
    setShowChoices(false);
    setShowFeedback(null);
    setShowVideo(false);
    setCorrect(false);
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

  function onChoiceAnswer(ans: string) {
    if (!session) return;
    const q = currentQuestions()[session.idx] as MathOrScienceQ;
    if ("choices" in q && q.answer.toString().toLowerCase() === ans.toLowerCase()) {
      setShowFeedback("correct");
      setTimeout(() => setShowVideo(true), 1000);
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
      setTimeout(() => setShowVideo(true), 1000);
    } else {
      setShowFeedback("wrong");
    }
  }

  function onNextQuestion() {
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
      <div className="flex flex-col items-center w-full">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2">
          Welcome {user.name}!
        </h1>
        <p className="mb-8 text-lg text-gray-700 text-center">{welcomeMsg}</p>
        <button
          onClick={handleLearnClick}
          className="bg-yellow-300 hover:bg-yellow-400 text-blue-900 font-bold text-lg px-8 py-3 rounded-lg mb-2 shadow-lg transition-colors"
        >
          Let’s Learn
        </button>
        <div className="mt-6 flex flex-col gap-4 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4 text-center text-blue-800">What do you want to learn today?</h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleChoice("Math")}
              className="bg-blue-300 hover:bg-blue-400 text-blue-900 font-bold py-2 rounded-lg shadow"
            >
              <b>Math</b>
            </button>
            <button
              onClick={() => handleChoice("English")}
              className="bg-green-200 hover:bg-green-300 text-green-900 font-bold py-2 rounded-lg shadow"
            >
              <b>English</b>
            </button>
            <button
              onClick={() => handleChoice("Science")}
              className="bg-pink-200 hover:bg-pink-300 text-pink-900 font-bold py-2 rounded-lg shadow"
            >
              <b>Science</b>
            </button>
            <button
              onClick={() => navigate("/personalized")}
              className="bg-purple-200 hover:bg-purple-300 text-purple-900 font-bold py-2 rounded-lg shadow"
            >
              <b>Personalized</b>
            </button>
          </div>
        </div>
      </div>
    );
  } else if (session && showVideo) {
    mainContent = (
      <div className="flex flex-col items-center justify-center w-full gap-4 mt-10">
        <div className="text-xl font-semibold text-blue-800 mb-4">Great job! Enjoy a break with Cocomelon!</div>
        <div className="w-full flex justify-center">
          <iframe
            width="360"
            height="203"
            src={COCOMELON_VIDEO}
            title="Cocomelon Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="rounded-lg border shadow-lg"
          ></iframe>
        </div>
        <button
          className="mt-6 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded shadow"
          onClick={() => {
            setShowVideo(false);
            setShowFeedback(null);
            setInput("");
            // Move to next question
            onNextQuestion();
          }}
        >
          Continue
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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="absolute top-4 right-6">
        <button
          onClick={logout}
          className="text-sm bg-gray-100 hover:bg-blue-100 px-4 py-2 rounded-lg border shadow text-blue-900 font-semibold"
        >
          Log out
        </button>
      </div>
      <div className="bg-white/95 px-10 py-12 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col items-center min-h-[420px]">
        {mainContent}
      </div>
    </div>
  );
};

export default Home;
