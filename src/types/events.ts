export type EventType = 'demolition-derby' | 'nejvetsi-skok' | 'hlavni-zavody';

export interface EventParticipant {
  id: string;
  firstName: string;
  lastName: string;
  startNumber: number;
  vehicleType: string;
  category: string;
}

export interface EventResult {
  participantId: string;
  position: number;
  points: number;
  time?: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  participantCount: number;
  eventTypes: EventType[]; // Changed to array to support multiple types
  startTime: string;
  description: string;
  schedule: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  winner?: string;
  prize?: string;
  participants: EventParticipant[];
  results?: EventResult[];
  imageUrl?: string;
  location?: string;
}

export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'hlavni-zavody', label: 'Hlavní závody' },
  { value: 'demolition-derby', label: 'Demolition Derby' },
  { value: 'nejvetsi-skok', label: 'Největší skok' },
];