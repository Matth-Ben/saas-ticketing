import { useState, useEffect } from 'react';
// TODO: Import API
// import { projectsApi, Project } from '@/lib/api/projects';

export function useProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // TODO: Fetch projects
    // const fetchProjects = async () => {
    //   try {
    //     setIsLoading(true);
    //     const data = await projectsApi.getProjects();
    //     setProjects(data);
    //   } catch (err) {
    //     setError(err as Error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchProjects();
  }, []);

  return { projects, isLoading, error };
}

