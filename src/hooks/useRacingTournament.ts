import { useState, useCallback } from 'react';
import { Racer, Tournament, RaceGroup, RaceResult, RacerCategory } from '@/types/racing';
import { createGroups, shouldAdvanceRacer, categories, generateRealRacers } from '@/utils/racingUtils';
import { TournamentSettings } from '@/types/tournamentSettings';

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

  const startTournament = useCallback((settings?: TournamentSettings) => {
    const activeRacers = racers.filter(r => r.isActive);
    if (activeRacers.length === 0) return;

    // Use settings if provided, otherwise use default behavior
    const racersPerGroup = settings?.racersPerGroup || 6;
    const enabledCategories = settings?.enabledCategories || categories;
    
    // Filter racers by enabled categories
    const filteredRacers = activeRacers.filter(r => 
      enabledCategories.includes(r.category)
    );
    
    if (filteredRacers.length === 0) return;

    const firstCategory = enabledCategories.find(cat => 
      filteredRacers.some(r => r.category === cat)
    ) || enabledCategories[0];

    const initialGroups = createGroups(filteredRacers, firstCategory, 1, racersPerGroup);

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
    console.log('CompleteRace called with:', { groupId, results });
    
    setRacers(prev => {
      const updatedRacers = prev.map(racer => {
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
      
      console.log('Updated racers:', updatedRacers);
      return updatedRacers;
    });

    setTournament(prev => {
      console.log('Previous tournament state:', prev);
      
      const updatedGroups = prev.groups.map(group => {
        if (group.id === groupId) {
          return { 
            ...group, 
            isCompleted: true, 
            results
          };
        }
        return group;
      });

      const newTournamentState = { 
        ...prev, 
        groups: updatedGroups
      };
      
      console.log('New tournament state:', newTournamentState);
      return newTournamentState;
    });
  }, []);

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

  const addRacersToGroup = useCallback((groupId: string, racerIds: string[]) => {
    setTournament(prev => ({
      ...prev,
      groups: prev.groups.map(group => {
        if (group.id === groupId) {
          // Find the racers to add
          const racersToAdd = racers.filter(r => racerIds.includes(r.id));
          return {
            ...group,
            racers: [...group.racers, ...racersToAdd]
          };
        }
        return group;
      })
    }));
  }, [racers]);

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
    getCurrentRaceGroup,
    addRacersToGroup
  };
};