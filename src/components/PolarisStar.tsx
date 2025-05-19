
import React from "react";

export default function PolarisStar() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto mb-3" aria-label="Polaris star">
      <circle cx="60" cy="60" r="24" fill="url(#starGlow)" />
      <g>
        <line x1="60" y1="5" x2="60" y2="115" stroke="#fffbe6" strokeWidth="2" />
        <line x1="5" y1="60" x2="115" y2="60" stroke="#fffbe6" strokeWidth="2" />
        <line x1="25" y1="25" x2="95" y2="95" stroke="#fffbe6" strokeWidth="1.4" />
        <line x1="25" y1="95" x2="95" y2="25" stroke="#fffbe6" strokeWidth="1.4" />
        <circle cx="60" cy="60" r="13" fill="url(#starRadial)" />
        <circle cx="60" cy="60" r="6" fill="#fffde8" />
      </g>
      <defs>
        <radialGradient id="starGlow" cx="60" cy="60" r="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffbe6" stopOpacity={0.85} />
          <stop offset="1" stopColor="#f5e46b" stopOpacity={0.2} />
        </radialGradient>
        <radialGradient id="starRadial" cx="60" cy="60" r="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffbe6" stopOpacity={0.98} />
          <stop offset="1" stopColor="#f5d142" stopOpacity={0.6} />
        </radialGradient>
      </defs>
    </svg>
  );
}
