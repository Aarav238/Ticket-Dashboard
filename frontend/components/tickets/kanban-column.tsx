"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Ticket, TicketStatus } from "@/types";
import { TicketCard } from "./ticket-card";

/**
 * Kanban Column Component
 * Droppable column for tickets in a specific status
 */
interface KanbanColumnProps {
  id: TicketStatus;
  title: string;
  tickets: Ticket[];
  color: "blue" | "yellow" | "green";
}

export function KanbanColumn({ id, title, tickets, color }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  const colorClasses = {
    blue: "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
    yellow: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
    green: "border-green-500 bg-green-50 dark:bg-green-950/20",
  };

  const headerColors = {
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Column header */}
      <div className={`${headerColors[color]} rounded-t-xl p-4 shadow-sm`}>
        <h3 className="text-white font-semibold text-lg flex items-center justify-between">
          {title}
          <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
            {tickets.length}
          </span>
        </h3>
      </div>

      {/* Column body - droppable area */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-4 border-2 border-t-0 ${colorClasses[color]} rounded-b-xl min-h-[500px]`}
      >
        <SortableContext
          items={tickets.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {tickets.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-600">
                <p className="text-sm">No tickets</p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

