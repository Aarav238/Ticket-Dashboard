"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export const Tooltip = ({
  content,
  children,
  position = "top",
  delay = 0,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, delay: delay / 1000 }}
            className={`absolute z-50 ${positionClasses[position]}`}
          >
            <div className="px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-md shadow-lg whitespace-nowrap">
              {content}
              {/* Arrow */}
              <div
                className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45 ${
                  position === "top"
                    ? "bottom-[-4px] left-1/2 -translate-x-1/2"
                    : position === "bottom"
                    ? "top-[-4px] left-1/2 -translate-x-1/2"
                    : position === "left"
                    ? "right-[-4px] top-1/2 -translate-y-1/2"
                    : "left-[-4px] top-1/2 -translate-y-1/2"
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

