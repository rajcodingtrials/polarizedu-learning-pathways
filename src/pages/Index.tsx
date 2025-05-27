
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

// Use the most recently uploaded image as the banner
const bannerImg = "/lovable-uploads/86f25f76-b812-4d96-b7cc-b73be2c1a501.png";

const Index = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else if (data.user) {
      setUser(data.user);
      toast({ title: "Logged in", description: "Successfully signed in!" });
      navigate("/home", { replace: true });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else if (data.user) {
      toast({ title: "Account created!", description: "Please check your email for confirmation (if required)." });
      setAuthMode("login");
      setEmail("");
      setPassword("");
    }
  };

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
      {/* Login/Signup Form */}
      <div className="flex flex-col items-center flex-1 justify-start pt-10">
        <div className="w-[340px] bg-white/95 rounded-xl shadow-xl px-8 py-8 flex flex-col">
          <h2 className="text-2xl font-semibold text-center mb-6">{authMode === "login" ? "Sign In" : "Sign Up"}</h2>
          <form onSubmit={authMode === "login" ? handleLogin : handleSignup}>
            <label className="block mb-2 font-semibold text-gray-700">Email</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="mb-4"
            />
            <label className="block mb-2 font-semibold text-gray-700">Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={authMode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
              className="mb-6"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? (authMode === "login" ? "Logging in..." : "Signing up...") : (authMode === "login" ? "Login" : "Sign Up")}
            </button>
            {errorMsg && <div className="text-red-600 text-center mt-3">{errorMsg}</div>}
          </form>
          <div className="mt-5 text-center text-base text-gray-700">
            {authMode === "login" ? (
              <>
                Not a member?{" "}
                <button className="text-blue-700 hover:underline" onClick={() => { setAuthMode("signup"); setErrorMsg(""); }}>
                  Please sign up
                </button>
              </>
            ) : (
              <>
                Already registered?{" "}
                <button className="text-blue-700 hover:underline" onClick={() => { setAuthMode("login"); setErrorMsg(""); }}>
                  Login here
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
