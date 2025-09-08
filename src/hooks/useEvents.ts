import { useState } from 'react';
import { Event, EventParticipant } from '@/types/events';

// Mock participants data
const mockParticipants: EventParticipant[] = [
  { id: '1', firstName: 'Jan', lastName: 'Novák', startNumber: 1, vehicleType: 'BMW E30', category: 'nad 1.6L' },
  { id: '2', firstName: 'Petr', lastName: 'Svoboda', startNumber: 2, vehicleType: 'VW Golf', category: 'do 1.6L' },
  { id: '3', firstName: 'Anna', lastName: 'Krásná', startNumber: 3, vehicleType: 'Škoda Octavia', category: 'Ženy' },
  { id: '4', firstName: 'Tomáš', lastName: 'Dvořák', startNumber: 4, vehicleType: 'Audi A4', category: 'nad 1.6L' },
];

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
      prize: '50,000 Kč',
      participants: mockParticipants
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
      prize: '30,000 Kč',
      participants: mockParticipants.slice(0, 3)
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
      prize: '40,000 Kč',
      participants: mockParticipants,
      results: [
        { participantId: '1', position: 1, points: 25, time: '2:45.123' },
        { participantId: '2', position: 2, points: 18, time: '2:47.456' },
        { participantId: '3', position: 3, points: 15, time: '2:48.789' },
        { participantId: '4', position: 4, points: 12, time: '2:50.234' },
      ]
    }
  ]);

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      participants: eventData.participants || [],
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