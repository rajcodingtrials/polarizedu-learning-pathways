
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import { useAuth } from "../components/AuthContext";

const exampleQ = {
  math: {
    question: "What is 5 + 2?",
    img: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=400&q=80",
    choices: ["6", "7", "8"],
    answer: "7",
  },
  english: {
    question: "Spell the word in the picture.",
    img: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&q=80", // cat
    answer: "cat",
  },
  science: {
    question: "Which part of the plant is shown in this image?",
    img: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&w=400&q=80", // mountain, but imagine roots/plant
    choices: ["Stem", "Root", "Leaf"],
    answer: "Root",
  },
};

function getSubject(search: string) {
  const p = new URLSearchParams(search);
  return (p.get("subject") || "").toLowerCase();
}

const Learn = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const subject = getSubject(location.search);

  if (!user) return null;

  let content = null;

  if (subject === "math") {
    content = (
      <QuestionCard question={exampleQ.math.question} image={exampleQ.math.img}>
        <div className="flex gap-4">
          {exampleQ.math.choices.map((choice) => (
            <button
              key={choice}
              onClick={() => alert(choice === exampleQ.math.answer ? "Correct!" : "Try again!")}
              className="bg-blue-100 hover:bg-yellow-200 px-4 py-2 rounded-lg shadow"
            >
              {choice}
            </button>
          ))}
        </div>
      </QuestionCard>
    );
  } else if (subject === "english") {
    content = (
      <QuestionCard
        question={exampleQ.english.question}
        image={exampleQ.english.img}
        largeImg
      >
        <input
          placeholder="Type your answer..."
          className="rounded-lg mt-3 px-4 py-2 border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 text-lg"
          maxLength={3}
        />
        <div className="text-gray-500 text-sm mt-1">(Hint: This is a cute animal!)</div>
      </QuestionCard>
    );
  } else if (subject === "science") {
    content = (
      <QuestionCard question={exampleQ.science.question} image={exampleQ.science.img}>
        <div className="flex gap-4">
          {exampleQ.science.choices.map((choice) => (
            <button
              key={choice}
              onClick={() => alert(choice === exampleQ.science.answer ? "Correct!" : "Try again!")}
              className="bg-green-100 hover:bg-green-200 px-4 py-2 rounded-lg shadow"
            >
              {choice}
            </button>
          ))}
        </div>
      </QuestionCard>
    );
  } else {
    content = (
      <div className="text-center mt-12 text-xl text-gray-700">
        No subject selected.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 via-indigo-900 to-black">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate("/home")}
          className="bg-gray-100 hover:bg-blue-100 px-4 py-2 rounded-lg border shadow text-blue-900 font-semibold"
        >
          ← Back
        </button>
      </div>
      <div className="pt-12 w-full max-w-xl">{content}</div>
    </div>
  );
};

export default Learn;
