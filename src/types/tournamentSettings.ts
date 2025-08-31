import { RacerCategory } from './racing';

export interface PointSystem {
  minPoints: number;
  maxPoints: number;
}

export type TrackOption = 'ostrava' | 'hrachovec' | 'branky';

export interface TournamentSettings {
  racersPerGroup: number;
  pointSystem: PointSystem;
  enabledCategories: RacerCategory[];
  selectedTrack: TrackOption;
}

export const defaultTournamentSettings: TournamentSettings = {
  racersPerGroup: 6,
  pointSystem: {
    minPoints: 0,
    maxPoints: 3
  },
  enabledCategories: ['do 1.6L', 'nad 1.6L', 'Ženy'],
  selectedTrack: 'ostrava'
};