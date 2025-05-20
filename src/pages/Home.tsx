
import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const motivational = {
  betty: "Hi Betty, welcome back! You’ve made great progress on PolarizEdu.",
  ethan:
    "Hope your vacation went great. Let’s start from where you left off last week. You’ve made a great job learning about making effective conversations.",
};

const Home = () => {
  const { user, logout } = useAuth();
  const [showChoices, setShowChoices] = useState(false);
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
  }

  function handleChoice(subject: string) {
    if (subject === "Personalized") {
      navigate("/personalized");
    } else {
      navigate(`/learn?subject=${subject.toLowerCase()}`);
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
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Welcome {user.name}!</h1>
        <p className="mb-8 text-lg text-gray-700 text-center">{welcomeMsg}</p>
        {!showChoices && (
          <button
            onClick={handleLearnClick}
            className="bg-yellow-300 hover:bg-yellow-400 text-blue-900 font-bold text-lg px-8 py-3 rounded-lg mb-2 shadow-lg transition-colors"
          >
            Let’s Learn
          </button>
        )}
        {showChoices && (
          <div className="mt-6 flex flex-col gap-4 w-full">
            <h2 className="text-lg font-semibold mb-4 text-center text-blue-800">What do you want to learn today?</h2>
            <div className="flex flex-col gap-3">
              {/* Make choices bold */}
              <button
                onClick={() => handleChoice("Math")}
                className="bg-blue-300 hover:bg-blue-400 text-blue-900 font-bold py-2 rounded-lg shadow"
              >
                Math
              </button>
              <button
                onClick={() => handleChoice("English")}
                className="bg-green-200 hover:bg-green-300 text-green-900 font-bold py-2 rounded-lg shadow"
              >
                English
              </button>
              <button
                onClick={() => handleChoice("Science")}
                className="bg-pink-200 hover:bg-pink-300 text-pink-900 font-bold py-2 rounded-lg shadow"
              >
                Science
              </button>
              <button
                onClick={() => handleChoice("Personalized")}
                className="bg-purple-200 hover:bg-purple-300 text-purple-900 font-bold py-2 rounded-lg shadow"
              >
                Personalized
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
