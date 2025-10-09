"use client";
import React from "react";

export const AceternityLoading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-900">
      <div className="w-[340px] sm:w-[400px] rounded-2xl bg-white dark:bg-neutral-800 shadow-xl p-8 flex flex-col gap-6 animate-pulse">
        {/* Title shimmer */}
        <div className="h-6 w-2/3 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-700 dark:via-neutral-800 dark:to-neutral-700 shimmer" />
        {/* Subtitle shimmer */}
        <div className="h-4 w-1/2 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-700 dark:via-neutral-800 dark:to-neutral-700 shimmer" />
        {/* Content shimmer blocks */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="h-4 w-full rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-700 dark:via-neutral-800 dark:to-neutral-700 shimmer" />
          <div className="h-4 w-5/6 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-700 dark:via-neutral-800 dark:to-gray-700 shimmer" />
          <div className="h-4 w-2/3 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-700 dark:via-neutral-800 dark:to-gray-700 shimmer" />
        </div>
        {/* Button shimmer */}
        <div className="h-10 w-1/3 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-700 dark:via-neutral-800 dark:to-gray-700 shimmer mt-6" />
      </div>
      <style jsx>{`
        .shimmer {
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};
