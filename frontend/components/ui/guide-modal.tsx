"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, CheckCircle, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { guideSections } from "@/lib/guide-data";
import type { GuideSection } from "@/types/guide";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const currentSection = guideSections[currentSectionIndex];
  
  // Calculate progress: 50% for visiting all sections + 50% for completing all sections
  // This way when all sections are completed, progress reaches 100%
  const sectionsVisited = currentSectionIndex + 1;
  const visitProgress = (sectionsVisited / guideSections.length) * 50; // Max 50% for visiting
  const completionProgress = (completedSections.length / guideSections.length) * 50; // Max 50% for completing
  const progress = visitProgress + completionProgress;

  const handleNext = () => {
    if (currentSectionIndex < guideSections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleCompleteSection = () => {
    if (!completedSections.includes(currentSection.id)) {
      setCompletedSections(prev => [...prev, currentSection.id]);
    }
  };

  const handleSectionSelect = (index: number) => {
    setCurrentSectionIndex(index);
  };

  const handleResetProgress = () => {
    setCompletedSections([]);
    setCurrentSectionIndex(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Ticket Dashboard Guide
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learn how to use all features effectively
                  </p>
                </div>
              </div>
              <Tooltip content="Close Guide" position="bottom">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </Tooltip>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Progress: {Math.round(progress)}% ({completedSections.length} completed)
                  </span>
                  <Tooltip 
                    content={
                      <div className="text-left whitespace-nowrap">
                        <div className="font-semibold mb-2">How Progress Works:</div>
                        <div className="space-y-1">
                          <div className="whitespace-nowrap">• <span className="font-medium">50%</span> for visiting all sections</div>
                          <div className="whitespace-nowrap">• <span className="font-medium">50%</span> for completing all sections</div>
                          <div className="whitespace-nowrap">• <span className="font-medium">100%</span> when both are done</div>
                        </div>
                      </div>
                    }
                    position="bottom"
                  >
                    <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center cursor-pointer">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">?</span>
                    </div>
                  </Tooltip>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentSectionIndex + 1} of {guideSections.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>Visit sections to progress</span>
                  <span>Mark complete to finish</span>
                </div>
                {completedSections.length > 0 && (
                  <Tooltip content="Reset all completed sections" position="top">
                    <button
                      onClick={handleResetProgress}
                      className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer"
                    >
                      Reset Progress
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Guide Sections
                  </h3>
                  <div className="space-y-1">
                    {guideSections.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => handleSectionSelect(index)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          index === currentSectionIndex
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {completedSections.includes(section.id) ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              section.icon
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {section.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {section.estimatedTime}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <GuideSectionContent section={currentSection} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentSection.difficulty === 'Beginner' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : currentSection.difficulty === 'Intermediate'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {currentSection.difficulty}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentSection.estimatedTime}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentSectionIndex === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleCompleteSection}
                  variant={completedSections.includes(currentSection.id) ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  {completedSections.includes(currentSection.id) ? 'Completed' : 'Mark Complete'}
                </Button>

                <Button
                  onClick={currentSectionIndex === guideSections.length - 1 ? onClose : handleNext}
                  className="flex items-center gap-2"
                >
                  {currentSectionIndex === guideSections.length - 1 ? 'Finish' : 'Next'}
                  {currentSectionIndex < guideSections.length - 1 && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Individual section content component
function GuideSectionContent({ section }: { section: GuideSection }) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
          {section.icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {section.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {section.description}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {section.content.map((item, index) => (
          <GuideContentItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

// Individual content item component
function GuideContentItem({ item }: { item: any }) {
  const getIcon = () => {
    switch (item.type) {
      case 'step':
        return <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">•</div>;
      case 'tip':
        return <div className="w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-semibold">💡</div>;
      case 'warning':
        return <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center text-sm font-semibold">⚠</div>;
      default:
        return <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center text-sm font-semibold">📝</div>;
    }
  };

  const getBorderColor = () => {
    switch (item.type) {
      case 'step':
        return 'border-l-blue-500';
      case 'tip':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-yellow-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className={`border-l-4 ${getBorderColor()} pl-4`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          {item.title && (
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {item.title}
            </h4>
          )}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {item.content}
          </p>
          {item.code && (
            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                {item.code}
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
