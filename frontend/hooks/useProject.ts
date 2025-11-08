import { useState, useEffect } from 'react';
// TODO: Import API
// import { projectsApi, Project } from '@/lib/api/projects';

export function useProject(id: string) {
  const [project, setProject] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // TODO: Fetch project
    // const fetchProject = async () => {
    //   try {
    //     setIsLoading(true);
    //     const data = await projectsApi.getProject(id);
    //     setProject(data);
    //   } catch (err) {
    //     setError(err as Error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchProject();
  }, [id]);

  return { project, isLoading, error };
}

