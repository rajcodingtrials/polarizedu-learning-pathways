
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";

// Use the most recently uploaded image as the banner
const bannerImg = "/lovable-uploads/86f25f76-b812-4d96-b7cc-b73be2c1a501.png";

const Index = () => {
  const navigate = useNavigate();
  // Remove "login" from destructuring, since it's not provided by useAuth
  const { user } = useAuth();

  // Remove all local state/auth logic & forms from before
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
        <h2 className="text-2xl font-semibold text-gray-800 mt-2 mb-8 text-center">
          Welcome to PolarizEd!
        </h2>
        <a
          href="/auth"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow transition-colors"
        >
          Login / Sign Up
        </a>
      </div>
    </div>
  );
};
export default Index;

