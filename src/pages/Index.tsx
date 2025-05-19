
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PolarisStar from "../components/PolarisStar";
import { useAuth } from "../components/AuthContext";
import { toast } from "@/hooks/use-toast";

// Placeholder image for north star scene
const polarisImg = "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=600&q=80";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-indigo-900 to-black relative">
      <div className="absolute inset-x-0 top-0 pt-10 z-0">
        <img
          src={polarisImg}
          alt="Polaris night sky"
          className="mx-auto rounded-xl shadow-lg w-[480px] h-[280px] object-cover opacity-85"
          style={{ border: "3px solid #fffde8" }}
        />
      </div>
      <div className="relative z-10 flex flex-col items-center mt-44">
        <PolarisStar />
        <h1 className="text-5xl font-extrabold text-white tracking-wide drop-shadow-lg mb-2 font-sans">PolarizEdu</h1>
        <h2 className="text-xl mb-6 text-blue-100 font-semibold tracking-wide">Walking beside the child, lighting the way</h2>
        <form
          onSubmit={onLogin}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-8 py-8 w-80 flex flex-col"
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
