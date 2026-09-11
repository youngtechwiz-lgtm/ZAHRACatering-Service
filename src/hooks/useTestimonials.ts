import { useState, useEffect, useCallback } from 'react';
import { testimonialService } from '../services/testimonialService';
import type { Testimonial } from '../types';

export function useTestimonials(publishedOnly: boolean = true) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await testimonialService.getTestimonials(publishedOnly);
      setTestimonials(data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Unable to load testimonials.');
    } finally {
      setIsLoading(false);
    }
  }, [publishedOnly]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  return {
    testimonials,
    isLoading,
    error,
    refreshTestimonials: fetchTestimonials,
  };
}
