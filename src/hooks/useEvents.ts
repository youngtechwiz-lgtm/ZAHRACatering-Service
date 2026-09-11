import { useState, useEffect, useCallback } from 'react';
import { eventsService } from '../services/eventsService';
import type { EventItem } from '../types';

export function useEvents(publishedOnly: boolean = true) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await eventsService.getEvents(publishedOnly);
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Unable to load events.');
    } finally {
      setIsLoading(false);
    }
  }, [publishedOnly]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    refreshEvents: fetchEvents,
  };
}
