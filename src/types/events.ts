export type EventType = 'turnaj' | 'demolition-derby' | 'nejvetsi-skok' | 'hlavni-zavody';

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  participantCount: number;
  eventType: EventType;
  startTime: string;
  description: string;
  schedule: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  winner?: string;
  prize?: string;
}

export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'turnaj', label: 'Turnaj' },
  { value: 'hlavni-zavody', label: 'Hlavní závody' },
  { value: 'demolition-derby', label: 'Demolition Derby' },
  { value: 'nejvetsi-skok', label: 'Největší skok' },
];