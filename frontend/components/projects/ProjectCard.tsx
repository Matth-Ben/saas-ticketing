import React from 'react';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    status: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
      {project.description && (
        <p className="text-gray-600 mb-2">{project.description}</p>
      )}
      <span className="text-sm text-gray-500">Status: {project.status}</span>
      {/* TODO: Add more project details */}
    </div>
  );
}

