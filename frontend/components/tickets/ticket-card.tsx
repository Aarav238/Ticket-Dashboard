"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuthStore } from "@/store/authStore";
import { Ticket, TicketPriority, TicketType } from "@/types";
import { EditTicketModal } from "./edit-ticket-modal";
import { 
  AlertCircle, 
  Bug, 
  Lightbulb, 
  CheckSquare,
  TrendingUp,
  GripVertical 
} from "lucide-react";

/**
 * Ticket Card Component
 * Individual ticket card with drag-and-drop functionality
 */
interface TicketCardProps {
  ticket: Ticket;
  isDragging?: boolean;
}

export function TicketCard({ ticket, isDragging = false }: TicketCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { isSuperUser } = useAuthStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  /**
   * Get priority color classes
   */
  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.URGENT:
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case TicketPriority.HIGH:
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case TicketPriority.MEDIUM:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case TicketPriority.LOW:
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  /**
   * Get ticket type icon
   */
  const getTypeIcon = (type: TicketType) => {
    switch (type) {
      case TicketType.BUG:
        return <Bug className="h-4 w-4" />;
      case TicketType.FEATURE:
        return <Lightbulb className="h-4 w-4" />;
      case TicketType.TASK:
        return <CheckSquare className="h-4 w-4" />;
      case TicketType.IMPROVEMENT:
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer ${
          isDragging ? "rotate-3 shadow-xl" : ""
        }`}
        onClick={() => setIsEditModalOpen(true)}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" />
            <div className="flex items-center gap-2">
              {getTypeIcon(ticket.type)}
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {ticket.type}
              </span>
            </div>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(
              ticket.priority
            )}`}
          >
            {ticket.priority}
          </span>
        </div>

        {/* Title */}
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {ticket.title}
        </h4>

        {/* Description */}
        {ticket.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {ticket.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          {isSuperUser ? (
            <div className="flex items-center gap-2">
              {ticket.assignee_email ? (
                <div className="flex items-center gap-1">
                  <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-medium">
                    {ticket.assignee_email.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate max-w-[100px]">
                    {ticket.assignee_email}
                  </span>
                </div>
              ) : (
                <span className="text-gray-400 dark:text-gray-600">Unassigned</span>
              )}
            </div>
          ) : (
            <div />
          )}
          <span>#{ticket.id.slice(0, 8)}</span>
        </div>
      </div>

      {/* Edit modal */}
      <EditTicketModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        ticket={ticket}
      />
    </>
  );
}

