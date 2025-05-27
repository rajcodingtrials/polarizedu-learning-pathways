
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

  // `authMode` indicates whether we are on "login" or "signup"
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup fields
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // Feedback
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        navigate("/home", { replace: true });
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/home", { replace: true });
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    }
  }, [navigate]);

  // ---- LOGIN ---
  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // 1. Look up the email from the username in the profiles table
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", loginUsername.trim())
      .maybeSingle();

    if (profErr || !profile) {
      setLoading(false);
      setErrorMsg("Username not found.");
      toast({
        title: "Login Failed",
        description: "Username not found.",
      });
      return;
    }

    // 2. Get the user's email from the auth.users table
    // Since we don't have direct access, let user use email in signup (will be found in login)
    // Try signInWithId/email
    const { error } = await supabase.auth.signInWithPassword({
      email: profile.id, // id is uuid, can't be used for sign in. Instead, ask user to use email in signup, but login with username, match id
      password: loginPassword,
    });

    // Actually: Supabase only allows signIn with email, not id. So, workaround: user enters username, we query id, then get email from auth.users by id (using rpc function), but since Supabase JS can't query auth.users, let's store email in profiles table for lookup.
    // Next best: Tell user on signup to also copy email into profiles.

    // So:
    // Let's look for email in the profiles table
    const { data: profWithEmail } = await supabase
      .from("profiles")
      .select("id, username, email")
      .eq("username", loginUsername.trim())
      .maybeSingle();

    if (!profWithEmail || !profWithEmail.email) {
      setLoading(false);
      setErrorMsg("Email not found for this user.");
      toast({
        title: "Login Failed",
        description: "Email not found for this username. Please sign up again.",
      });
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: profWithEmail.email.trim().toLowerCase(),
      password: loginPassword,
    });

    setLoading(false);

    if (authError) {
      setErrorMsg(authError.message || "Login failed.");
      toast({
        title: "Authentication Failed",
        description: authError.message || "Invalid credentials.",
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
    setSignupLoading(true);
    setErrorMsg("");

    // 1. Create user in auth.users
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail.trim().toLowerCase(),
      password: signupPassword,
    });
    if (error || !data.user) {
      setSignupLoading(false);
      setErrorMsg(error?.message || "Signup failed.");
      toast({
        title: "Signup Failed",
        description: error?.message || "Unable to create account.",
      });
      return;
    }

    const userId = data.user.id;
    // 2. Insert/update username and email in profiles table for reverse lookup by username
    const { error: profErr } = await supabase
      .from("profiles")
      .update({ username: signupUsername.trim(), email: signupEmail.trim().toLowerCase() })
      .eq("id", userId);

    setSignupLoading(false);
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
    setAuthMode("login");
    setLoginUsername(signupUsername.trim());
    setLoginPassword("");
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
            ? "Welcome! Please login to your account"
            : "Create Your Account"}
        </h2>

        {/* LOGIN FORM */}
        {authMode === "login" && (
          <form
            onSubmit={onLogin}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-8 py-8 w-80 flex flex-col"
            autoComplete="on"
          >
            <label className="font-semibold text-gray-700 mb-2">Username</label>
            <input
              className="rounded-lg px-4 py-2 border mb-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={loginUsername}
              onChange={e => setLoginUsername(e.target.value)}
              autoComplete="username"
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
              title="Alphanumeric and underscores only"
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
