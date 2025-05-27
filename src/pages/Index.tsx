
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Use the most recently uploaded image as the banner
const bannerImg = "/lovable-uploads/86f25f76-b812-4d96-b7cc-b73be2c1a501.png";

// Utility: get user session
async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

const Index = () => {
  const navigate = useNavigate();

  // Tabs: "login" or "signup"
  const [tab, setTab] = useState<"login" | "signup">("login");
  // Shared state
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup fields
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  // Feedback
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        navigate("/home", { replace: true });
      }
    });
    // Also subscribe to auth state changes and redirect
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/home", { replace: true });
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    }
  }, [navigate]);

  // --- LOGIN ---
  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim().toLowerCase(),
      password: loginPassword,
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message || "Login failed.");
      toast({
        title: "Authentication Failed",
        description: error.message || "Invalid credentials.",
      });
      return;
    }
    toast({
      title: "Successfully logged in!",
      description: "Redirecting to your account...",
    });
    navigate("/home");
  }

  // --- SIGN UP ---
  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    // 1. Create user in auth.users
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail.trim().toLowerCase(),
      password: signupPassword,
    });
    if (error || !data.user) {
      setLoading(false);
      setErrorMsg(error?.message || "Signup failed.");
      toast({
        title: "Signup Failed",
        description: error?.message || "Unable to create account.",
      });
      return;
    }
    // 2. Insert/update username in profiles table
    const userId = data.user.id;
    const { error: profErr } = await supabase
      .from("profiles")
      .update({ username: signupUsername.trim() })
      .eq("id", userId);
    setLoading(false);
    if (profErr) {
      setErrorMsg(profErr.message);
      toast({
        title: "Signup Error",
        description: "User created, but profile update failed: " + profErr.message,
      });
      return;
    }
    toast({
      title: "Account created!",
      description: "You’re signed in. Welcome!",
    });
    navigate("/home");
  }

  // --- UI ---
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Black Bar */}
      <div className="w-full h-12 bg-black flex items-center px-8 justify-between">
        {/* Company Title */}
        <span className="text-white text-lg font-bold tracking-wide">
          PolarizEd
        </span>
        {/* Right Tabs */}
        <div className="flex space-x-6">
          <Link to="/our-story" className="text-white text-base font-medium hover:underline focus:underline transition">Our Story</Link>
          <Link to="/team" className="text-white text-base font-medium hover:underline focus:underline transition">Team</Link>
        </div>
      </div>

      {/* Banner image, full width, fully shown */}
      <div className="w-full">
        <img
          src={bannerImg}
          alt="Banner"
          className="w-full h-auto"
          style={{
            display: "block",
            width: "100vw",
            maxWidth: "100%",
            objectFit: "contain",
            objectPosition: "center",
            marginLeft: "calc(-50vw + 50%)",
          }}
        />
      </div>

      <div className="flex flex-col items-center flex-1 justify-center pt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mt-2 mb-6 text-center">
          {tab === "login" ? "Welcome! Please login to your account" : "Create Your Account"}
        </h2>

        {/* Auth Tabs */}
        <div className="flex mb-4 space-x-4">
          <button
            onClick={() => { setTab("login"); setErrorMsg(""); }}
            className={`px-4 py-2 rounded-t-lg font-medium border-b-2 ${tab === "login" ? "border-yellow-400 text-blue-900" : "border-transparent text-gray-400"}`}
          >
            Login
          </button>
          <button
            onClick={() => { setTab("signup"); setErrorMsg(""); }}
            className={`px-4 py-2 rounded-t-lg font-medium border-b-2 ${tab === "signup" ? "border-yellow-400 text-blue-900" : "border-transparent text-gray-400"}`}
          >
            Sign Up
          </button>
        </div>

        {/* LOGIN FORM */}
        {tab === "login" && (
          <form
            onSubmit={onLogin}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-8 py-8 w-80 flex flex-col"
            autoComplete="on"
          >
            <label className="font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="rounded-lg px-4 py-2 border mb-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <label className="font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="rounded-lg px-4 py-2 border mb-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-yellow-300 hover:bg-yellow-400 text-blue-900 font-bold py-2 rounded-lg shadow transition-colors ${loading ? "opacity-60 cursor-wait" : ""}`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {errorMsg && (
              <div className="text-red-600 text-center mt-3">{errorMsg}</div>
            )}
          </form>
        )}

        {/* SIGNUP FORM */}
        {tab === "signup" && (
          <form
            onSubmit={onSignup}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-8 py-8 w-80 flex flex-col"
            autoComplete="on"
          >
            <label className="font-semibold text-gray-700 mb-2">Username</label>
            <input
              className="rounded-lg px-4 py-2 border mb-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={signupUsername}
              onChange={e => setSignupUsername(e.target.value)}
              autoComplete="username"
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
              title="Alphanumeric and underscores only"
              required
            />
            <label className="font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="rounded-lg px-4 py-2 border mb-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={signupEmail}
              onChange={e => setSignupEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <label className="font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="rounded-lg px-4 py-2 border mb-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={signupPassword}
              onChange={e => setSignupPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-yellow-300 hover:bg-yellow-400 text-blue-900 font-bold py-2 rounded-lg shadow transition-colors ${loading ? "opacity-60 cursor-wait" : ""}`}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
            {errorMsg && (
              <div className="text-red-600 text-center mt-3">{errorMsg}</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Index;
