import { useState } from 'react';
import { Event } from '@/types/events';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      name: 'VrakFest Championship 2024',
      date: '2024-12-31',
      participantCount: 24,
      eventTypes: ['hlavni-zavody', 'demolition-derby'],
      startTime: '18:00',
      description: 'Největší závodní událost roku',
      schedule: '18:00 - Registrace\n19:00 - Rozjezdy\n20:30 - Finálové jízdy\n22:00 - Vyhlášení výsledků',
      status: 'upcoming',
      prize: '50,000 Kč'
    },
    {
      id: '2',
      name: 'Spring Racing Cup',
      date: '2025-03-15',
      participantCount: 18,
      eventTypes: ['hlavni-zavody'],
      startTime: '16:30',
      description: 'Jarní pohár v závodech',
      schedule: '16:30 - Registrace\n17:30 - Závody\n19:00 - Vyhlášení',
      status: 'upcoming',
      prize: '30,000 Kč'
    },
    {
      id: '3',
      name: 'Winter Championship 2023',
      date: '2023-12-20',
      participantCount: 32,
      eventTypes: ['hlavni-zavody'],
      startTime: '19:00',
      description: 'Zimní mistrovství',
      schedule: 'Závod proběhl podle plánu',
      status: 'completed',
      winner: 'Jan Novák',
      prize: '40,000 Kč'
    }
  ]);

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...eventData } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getUpcomingEvents = () => {
    return events.filter(event => event.status === 'upcoming');
  };

  const getPastEvents = () => {
    return events.filter(event => event.status === 'completed');
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getUpcomingEvents,
    getPastEvents
  };
}