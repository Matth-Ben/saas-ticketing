import { useState, useEffect } from 'react';
// TODO: Import API
// import { stripeApi, Subscription } from '@/lib/api/stripe';

export function useSubscription() {
  const [subscription, setSubscription] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // TODO: Fetch subscription
    // const fetchSubscription = async () => {
    //   try {
    //     setIsLoading(true);
    //     const data = await stripeApi.getSubscription();
    //     setSubscription(data);
    //   } catch (err) {
    //     setError(err as Error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchSubscription();
  }, []);

  return { subscription, isLoading, error };
}

