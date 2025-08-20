import { RacerCategory } from './racing';

export interface PointSystem {
  minPoints: number;
  maxPoints: number;
}

export interface TournamentSettings {
  racersPerGroup: number;
  pointSystem: PointSystem;
  enabledCategories: RacerCategory[];
}

export const defaultTournamentSettings: TournamentSettings = {
  racersPerGroup: 6,
  pointSystem: {
    minPoints: 0,
    maxPoints: 3
  },
  enabledCategories: ['do 1.6L', 'nad 1.6L', 'Ženy']
};