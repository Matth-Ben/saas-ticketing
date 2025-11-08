'use client';

// TODO: Import hooks and components
// import { useProject } from '@/hooks/useProject';
// import { KanbanBoard } from '@/components/kanban/KanbanBoard';
// import { ProjectHeader } from '@/components/projects/ProjectHeader';

export default function ProjectPage({ params }: { params: { id: string } }) {
  // TODO: Implement project page
  // const { project, isLoading } = useProject(params.id);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Projet</h1>
      <p className="text-gray-600 mb-4">TODO: Implement project page</p>
      {/* TODO: Add project header, kanban board, tickets list */}
    </div>
  );
}

