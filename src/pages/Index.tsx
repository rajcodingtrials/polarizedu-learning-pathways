import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PolarisStar from "../components/PolarisStar";
import { useAuth } from "../components/AuthContext";
import { toast } from "@/hooks/use-toast";

// Placeholder image for north star scene
const polarisImg = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"; // Elder holding hand of a child

const Index = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(username.trim().toLowerCase(), password);
    if (ok) {
      setErrorMsg("");
      navigate("/home");
    } else {
      setErrorMsg("Invalid credentials.");
      toast({
        title: "Authentication Failed",
        description: "Invalid credentials.",
      });
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Black Bar */}
      <div className="w-full h-12 bg-black flex items-center px-8">
        <span className="text-white text-lg font-bold tracking-wide">PolarizEdu</span>
      </div>

      {/* Banner image */}
      <div className="w-full flex justify-center bg-white">
        <img
          src={polarisImg}
          alt="Elder holding hand of a child"
          className="mx-auto rounded-b-2xl shadow w-full max-w-screen-md object-cover h-72"
          style={{ objectPosition: "center top" }}
        />
      </div>

      <div className="flex flex-col items-center flex-1 justify-center pt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mt-2 mb-2">With Every Step, We Grow</h2>
        <form
          onSubmit={onLogin}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-8 py-8 w-80 flex flex-col mt-4"
        >
          <label className="font-semibold text-gray-700 mb-2">Username</label>
          <input
            className="rounded-lg px-4 py-2 border mb-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <label className="font-semibold text-gray-700 mb-2">Password</label>
          <input
            type="password"
            className="rounded-lg px-4 py-2 border mb-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="submit"
            className="bg-yellow-300 hover:bg-yellow-400 text-blue-900 font-bold py-2 rounded-lg shadow transition-colors"
          >
            Login
          </button>
          {errorMsg && (
            <div className="text-red-600 text-center mt-3">{errorMsg}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Index;
