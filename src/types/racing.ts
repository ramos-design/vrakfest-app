export type RacerCategory = 'do 1.6L' | 'nad 1.6L' | 'Ženy';

export interface Racer {
  id: string;
  firstName: string;
  lastName: string;
  startNumber: number;
  vehicleType: string;
  category: RacerCategory;
  points: number;
  isActive: boolean;
}

export interface RaceGroup {
  id: string;
  racers: Racer[];
  category: RacerCategory;
  round: number;
  isCompleted: boolean;
  hasStarted: boolean;
  results?: RaceResult[];
}

export interface Tournament {
  currentRound: number;
  currentCategory: RacerCategory;
  groups: RaceGroup[];
  isActive: boolean;
}

export interface RaceResult {
  racerId: string;
  points: number;
  advances: boolean;
}