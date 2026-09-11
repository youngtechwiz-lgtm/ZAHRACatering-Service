import { useState, useEffect, useCallback } from 'react';
import { servicesService } from '../services/servicesService';
import type { Service } from '../types';

export function useServices(publishedOnly: boolean = true) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await servicesService.getServices(publishedOnly);
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Unable to load services.');
    } finally {
      setIsLoading(false);
    }
  }, [publishedOnly]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    isLoading,
    error,
    refreshServices: fetchServices,
  };
}
