
import React from "react";

interface QuestionCardProps {
  question: string;
  image?: string;
  children?: React.ReactNode;
  largeImg?: boolean;
}

export default function QuestionCard({ question, image, children, largeImg }: QuestionCardProps) {
  return (
    <div className="rounded-xl bg-white/90 shadow-lg p-6 flex flex-col items-center max-w-lg mx-auto mb-6">
      {image && (
        <img
          src={image}
          alt="Question visual"
          className={`mb-4 ${largeImg ? "w-64 h-64" : "w-40 h-40"} object-contain rounded-lg`}
        />
      )}
      <h2 className="font-semibold text-xl text-gray-800 mb-2">{question}</h2>
      {children}
    </div>
  );
}
