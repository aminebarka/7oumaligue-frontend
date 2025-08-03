import React from 'react';

const Favicon: React.FC = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle cx="16" cy="16" r="16" fill="url(#gradient)" />
      
      {/* Football Pattern (simplified) */}
      <g opacity="0.3">
        <rect x="8" y="8" width="4" height="4" fill="#4ade80" rx="1" />
        <rect x="20" y="8" width="4" height="4" fill="#22c55e" rx="1" />
        <rect x="8" y="20" width="4" height="4" fill="#4ade80" rx="1" />
        <rect x="20" y="20" width="4" height="4" fill="#22c55e" rx="1" />
        <rect x="14" y="14" width="4" height="4" fill="#4ade80" rx="1" />
      </g>
      
      {/* Number 7 */}
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fill="white"
        fontSize="18"
        fontWeight="bold"
        transform="rotate(12 16 16)"
      >
        7
      </text>
      
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#115e59" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Favicon; 