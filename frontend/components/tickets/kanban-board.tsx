"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useTicketStore } from "@/store/ticketStore";
import { TicketStatus, Ticket } from "@/types";
import { KanbanColumn } from "./kanban-column";
import { TicketCard } from "./ticket-card";
import { socketService } from "@/lib/socket";

/**
 * Kanban Board Component
 * Drag-and-drop board with three columns: TODO, IN_PROGRESS, DONE
 */
interface KanbanBoardProps {
  projectId: string;
  tickets: Ticket[];
}

export function KanbanBoard({ projectId, tickets }: KanbanBoardProps) {
  const { moveTicket, getTicketsByStatus } = useTicketStore();
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required to start drag
      },
    })
  );

  /**
   * Get tickets for each column
   */
  const todoTickets = getTicketsByStatus(TicketStatus.TODO);
  const inProgressTickets = getTicketsByStatus(TicketStatus.IN_PROGRESS);
  const doneTickets = getTicketsByStatus(TicketStatus.DONE);

  /**
   * Handle drag start
   */
  const handleDragStart = (event: DragStartEvent) => {
    const ticketId = event.active.id as string;
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      setActiveTicket(ticket);
    }
  };

  /**
   * Handle drag end - update ticket status and order
   */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    const ticketId = active.id as string;
    const newStatus = over.id as TicketStatus;

    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    // If status hasn't changed, no need to update
    if (ticket.status === newStatus) return;

    // Get tickets in the new status column
    const targetColumnTickets = getTicketsByStatus(newStatus);
    const newOrderIndex = targetColumnTickets.length;

    // Update ticket status and order
    await moveTicket(ticketId, newStatus, newOrderIndex);

    // Emit Socket.io event for real-time updates
    const updatedTicket = {
      ...ticket,
      status: newStatus,
      order_index: newOrderIndex,
    };
    socketService.emitTicketMoved(projectId, updatedTicket);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TODO Column */}
        <KanbanColumn
          id={TicketStatus.TODO}
          title="To Do"
          tickets={todoTickets}
          color="blue"
        />

        {/* IN PROGRESS Column */}
        <KanbanColumn
          id={TicketStatus.IN_PROGRESS}
          title="In Progress"
          tickets={inProgressTickets}
          color="yellow"
        />

        {/* DONE Column */}
        <KanbanColumn
          id={TicketStatus.DONE}
          title="Done"
          tickets={doneTickets}
          color="green"
        />
      </div>

      {/* Drag overlay - shows dragged ticket */}
      <DragOverlay>
        {activeTicket ? (
          <div className="opacity-80 rotate-3">
            <TicketCard ticket={activeTicket} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

