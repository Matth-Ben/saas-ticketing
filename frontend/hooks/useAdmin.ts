import { useState, useEffect } from 'react';
// TODO: Import API
// import { apiClient } from '@/lib/api/client';

export function useAdmin() {
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // TODO: Fetch admin dashboard data
    // const fetchDashboard = async () => {
    //   try {
    //     setIsLoading(true);
    //     const response = await apiClient.get('/admin/dashboard');
    //     setDashboardData(response.data);
    //   } catch (err) {
    //     setError(err as Error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchDashboard();
  }, []);

  return { dashboardData, isLoading, error };
}

