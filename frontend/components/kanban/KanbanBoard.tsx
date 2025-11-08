'use client';

import React from 'react';
// TODO: Import react-beautiful-dnd
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface KanbanBoardProps {
  tickets: any[];
  onTicketMove?: (ticketId: string, newStatus: string) => void;
}

export function KanbanBoard({ tickets, onTicketMove }: KanbanBoardProps) {
  // TODO: Implement Kanban board with drag & drop
  // TODO: Group tickets by status
  // TODO: Implement drag and drop handlers

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-4">À faire</h2>
        {/* TODO: Render todo tickets */}
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-4">En cours</h2>
        {/* TODO: Render in_progress tickets */}
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-4">Terminé</h2>
        {/* TODO: Render done tickets */}
      </div>
    </div>
  );
}

