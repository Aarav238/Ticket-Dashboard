"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjectStore } from "@/store/projectStore";
import { useTicketStore } from "@/store/ticketStore";
import { useAuthStore } from "@/store/authStore";
import { AppLayout } from "@/components/layout/app-layout";
import { KanbanBoard } from "@/components/tickets/kanban-board";
import { CreateTicketModal } from "@/components/tickets/create-ticket-modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Plus } from "lucide-react";
import { socketService } from "@/lib/socket";

/**
 * Project Ticket Board Page
 * Kanban board with drag-and-drop for managing tickets
 * Real-time updates via Socket.io
 */
export default function ProjectBoardPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { currentProject, fetchProject, isLoading: projectLoading } = useProjectStore();
  const { 
    tickets, 
    fetchProjectTickets, 
    isLoading: ticketsLoading,
    addTicket,
    updateTicketInList,
    removeTicket,
  } = useTicketStore();
  const { isSuperUser } = useAuthStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch project and tickets on mount
  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
      fetchProjectTickets(projectId);

      // Join project room for real-time updates
      socketService.joinProject(projectId);
    }

    return () => {
      if (projectId) {
        socketService.leaveProject(projectId);
      }
    };
  }, [projectId, fetchProject, fetchProjectTickets]);

  // Setup Socket.io listeners for real-time ticket updates
  useEffect(() => {
    if (socketService.isSocketConnected()) {
      // Listen for ticket created
      socketService.onTicketCreated((ticket) => {
        if (ticket.project_id === projectId) {
          addTicket(ticket);
        }
      });

      // Listen for ticket updated
      socketService.onTicketUpdated((ticket) => {
        if (ticket.project_id === projectId) {
          updateTicketInList(ticket);
        }
      });

      // Listen for ticket moved
      socketService.onTicketMoved((ticket) => {
        if (ticket.project_id === projectId) {
          updateTicketInList(ticket);
        }
      });

      // Listen for ticket deleted
      socketService.onTicketDeleted((ticketId) => {
        removeTicket(ticketId);
      });
    }

    return () => {
      socketService.removeListener("ticket-created");
      socketService.removeListener("ticket-updated");
      socketService.removeListener("ticket-moved");
      socketService.removeListener("ticket-deleted");
    };
  }, [projectId, addTicket, updateTicketInList, removeTicket]);

  /**
   * Navigate back to projects page
   */
  const handleBack = () => {
    router.push("/projects");
  };

  const isLoading = projectLoading || ticketsLoading;

  return (
    <AppLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {currentProject?.name || "Loading..."}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {currentProject?.description || "No description"}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              New Ticket
            </Button>
          </div>

          {/* Kanban board */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="h-12 w-12 text-blue-600" />
            </div>
          ) : (
            <KanbanBoard projectId={projectId} tickets={tickets} />
          )}

          {/* Create ticket modal */}
          <CreateTicketModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            projectId={projectId}
          />
        </div>
      </div>
    </AppLayout>
  );
}

