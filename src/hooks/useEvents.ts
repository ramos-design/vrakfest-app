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
      id: '2026-1',
      name: 'VrakFest Ostrava',
      date: '2026-04-04',
      participantCount: 80,
      eventTypes: ['hlavni-zavody', 'demolition-derby'],
      startTime: '09:30',
      location: 'Vřesinská strž',
      description: 'První závod sezóny 2026 na legendární Vřesinské strži. Kvalifikační jízdy, eliminace a totální destrukce v závěrečném Demolition Derby.',
      schedule: '09:30 - Start Vrakfest Race\n15:30 - Semifinále Vrakfest Race\n16:00 - Finále Vrakfest Race\n17:30 - Demolition Derby\n18:00 - Vyhlášení výsledků',
      status: 'upcoming',
      prize: 'Trofej Vrakfest Champion 2026',
      participants: mockParticipants,
      imageUrl: '/events/championship.png'
    },
    {
      id: '2026-2',
      name: 'VrakFest Hrachovec',
      date: '2026-06-27',
      participantCount: 45,
      eventTypes: ['hlavni-zavody'],
      startTime: '10:00',
      location: 'Areál Ekorema',
      description: 'Letní závod v areálu Ekorema v Hrachovci. Připravte se na rychlou trať a skvělou atmosféru.',
      schedule: '10:00 - Technické přejímky\n11:00 - Start rozjížděk\n15:00 - Hlavní závod\n17:00 - Vyhlášení',
      status: 'upcoming',
      prize: 'Pohár Ekorema',
      participants: mockParticipants.slice(0, 3),
      imageUrl: '/events/spring.png'
    },
    {
      id: '2026-3',
      name: 'VrakFest Překvapení',
      date: '2026-08-22',
      participantCount: 50,
      eventTypes: ['hlavni-zavody'],
      startTime: '10:00',
      location: 'Nové místo',
      description: 'Zcela nová lokalita pro letošní sezónu. Budete překvapeni profilem tratě i prostředím.',
      schedule: 'Bude upřesněno před konáním akce.',
      status: 'upcoming',
      prize: 'Putovní pohár',
      participants: mockParticipants.slice(0, 2),
      imageUrl: '/events/winter.png'
    },
    {
      id: '2026-4',
      name: 'VrakFest Ostrava II.',
      date: '2026-10-24',
      participantCount: 80,
      eventTypes: ['hlavni-zavody', 'demolition-derby'],
      startTime: '09:30',
      location: 'Vřesinská strž',
      description: 'Závěrečný závod sezóny 2026. Rozhodující bitva o body do celkového pořadí a finální destrukce roku.',
      schedule: '09:30 - Start programu\n14:00 - Finálové jízdy\n16:30 - Sezónní vyhlášení\n17:30 - Poslední derby roku',
      status: 'upcoming',
      prize: 'Celosezónní pohár',
      participants: mockParticipants,
      imageUrl: '/events/championship.png'
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