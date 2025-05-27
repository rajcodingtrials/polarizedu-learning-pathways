
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";

// Use the most recently uploaded image as the banner
const bannerImg = "/lovable-uploads/86f25f76-b812-4d96-b7cc-b73be2c1a501.png";

const Index = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Auth mode: login or signup
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Signup fields
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // Demo mock "user database"
  const [users, setUsers] = useState<{ username: string; email: string; password: string; name: string }[]>([
    { username: "betty", password: "betty123", email: "betty@example.com", name: "Betty" },
    { username: "ethan", password: "ethan123", email: "ethan@example.com", name: "Ethan" }
  ]);

  // Handle Login
  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const userFound = users.find(u =>
      u.email.trim().toLowerCase() === loginEmail.trim().toLowerCase() &&
      u.password === loginPassword
    );
    setLoading(false);
    if (userFound) {
      // Call AuthContext login (mock)
      await login(userFound.username, userFound.password);
      navigate("/home");
    } else {
      setErrorMsg("Invalid email or password.");
    }
  }

  // Handle Signup
  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    setSignupLoading(true);
    setErrorMsg("");
    // Simple check
    if (users.some(u => u.email.trim().toLowerCase() === signupEmail.trim().toLowerCase())) {
      setSignupLoading(false);
      setErrorMsg("Email already in use.");
      return;
    }
    if (signupPassword.length < 6) {
      setSignupLoading(false);
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    // Add user to "db"
    setUsers([
      ...users,
      { username: signupUsername.trim(), email: signupEmail.trim().toLowerCase(), password: signupPassword, name: signupUsername.trim() }
    ]);
    setSignupLoading(false);
    setAuthMode("login");
    setLoginEmail(signupEmail.trim());
    setLoginPassword("");
    setErrorMsg("Account created! Please log in.");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Black Bar */}
      <div className="w-full h-12 bg-black flex items-center px-8 justify-between">
        {/* Company Title */}
        <span className="text-white text-lg font-bold tracking-wide">
          PolarizEd
        </span>
        <div className="flex space-x-6">
          <Link to="/our-story" className="text-white text-base font-medium hover:underline focus:underline transition">Our Story</Link>
          <Link to="/team" className="text-white text-base font-medium hover:underline focus:underline transition">Team</Link>
        </div>
      </div>
      {/* Banner image */}
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
          {authMode === "login"
            ? "Welcome! Please log in to your account"
            : "Create Your Account"}
        </h2>
        {/* LOGIN FORM */}
        {authMode === "login" && (
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
        {/* SIGNUP CTA LINK */}
        {authMode === "login" && (
          <div className="mt-4 text-base text-gray-700">
            Not a member?{" "}
            <button
              className="text-blue-800 hover:underline"
              onClick={() => {
                setAuthMode("signup");
                setErrorMsg("");
              }}
            >
              Please sign up
            </button>
          </div>
        )}
        {/* SIGNUP FORM */}
        {authMode === "signup" && (
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
              disabled={signupLoading}
              className={`bg-yellow-300 hover:bg-yellow-400 text-blue-900 font-bold py-2 rounded-lg shadow transition-colors ${signupLoading ? "opacity-60 cursor-wait" : ""}`}
            >
              {signupLoading ? "Signing up..." : "Sign Up"}
            </button>
            <div className="mt-3 text-center">
              <button
                type="button"
                className="text-sm text-blue-800 hover:underline"
                onClick={() => {
                  setAuthMode("login");
                  setErrorMsg("");
                }}
              >
                Back to Login
              </button>
            </div>
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
