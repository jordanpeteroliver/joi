
import React from 'react';

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.192A4.5 4.5 0 019.315 7.584zM12 15a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H12.75a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
    <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 019 10.5v1.875c0 1.036-.84 1.875-1.875 1.875h-.375A3.75 3.75 0 013 12.375V8.625z" />
  </svg>
);

export default SparkleIcon;
