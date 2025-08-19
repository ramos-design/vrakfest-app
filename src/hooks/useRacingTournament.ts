import { useState, useCallback } from 'react';
import { Racer, Tournament, RaceGroup, RaceResult, RacerCategory } from '@/types/racing';
import { createGroups, shouldAdvanceRacer, categories, generateRealRacers } from '@/utils/racingUtils';

export const useRacingTournament = () => {
  const [racers, setRacers] = useState<Racer[]>(() => generateRealRacers());
  const [tournament, setTournament] = useState<Tournament>({
    currentRound: 1,
    currentCategory: 'do 1.6L',
    groups: [],
    isActive: false
  });

  const addRacer = useCallback((newRacer: Omit<Racer, 'id'>) => {
    const id = `racer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setRacers(prev => [...prev, { ...newRacer, id }]);
  }, []);

  const updateRacer = useCallback((id: string, updatedRacer: Omit<Racer, 'id'>) => {
    setRacers(prev => prev.map(racer => 
      racer.id === id ? { ...updatedRacer, id } : racer
    ));
  }, []);

  const deleteRacer = useCallback((id: string) => {
    setRacers(prev => prev.filter(racer => racer.id !== id));
  }, []);

  const startTournament = useCallback(() => {
    const activeRacers = racers.filter(r => r.isActive);
    if (activeRacers.length === 0) return;

    const firstCategory = categories.find(cat => 
      activeRacers.some(r => r.category === cat)
    ) || 'do 1.6L';

    const initialGroups = createGroups(activeRacers, firstCategory, 1);

    setTournament({
      currentRound: 1,
      currentCategory: firstCategory,
      groups: initialGroups,
      isActive: true
    });
  }, [racers]);

  const startRace = useCallback((groupId: string) => {
    setTournament(prev => ({
      ...prev,
      groups: prev.groups.map(group =>
        group.id === groupId ? { ...group, hasStarted: true } : group
      )
    }));
  }, []);

  const completeRace = useCallback((groupId: string, results: RaceResult[]) => {
    // Update racer points and get updated racers
    let updatedRacers: Racer[];
    setRacers(prev => {
      updatedRacers = prev.map(racer => {
        const result = results.find(r => r.racerId === racer.id);
        if (result) {
          return {
            ...racer,
            points: racer.points + result.points,
            isActive: result.advances
          };
        }
        return racer;
      });
      return updatedRacers;
    });

    // Mark group as completed
    setTournament(prev => {
      const updatedGroups = prev.groups.map(group =>
        group.id === groupId ? { ...group, isCompleted: true } : group
      );

      // Simply return with completed group - don't advance rounds/categories until all groups are done
      return { ...prev, groups: updatedGroups };
    });
  }, [racers]);

  const resetTournament = useCallback(() => {
    setRacers(prev => prev.map(racer => ({ ...racer, points: 0, isActive: true })));
    setTournament({
      currentRound: 1,
      currentCategory: 'do 1.6L',
      groups: [],
      isActive: false
    });
  }, []);

  const getCurrentRaceGroup = useCallback(() => {
    return tournament.groups.find(g => g.hasStarted && !g.isCompleted) || null;
  }, [tournament.groups]);

  return {
    racers,
    tournament,
    addRacer,
    updateRacer,
    deleteRacer,
    startTournament,
    startRace,
    completeRace,
    resetTournament,
    getCurrentRaceGroup
  };
};