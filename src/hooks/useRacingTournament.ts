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
    // Update racer points and tournament simultaneously
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

      // Also update tournament groups with the updated racers
      setTournament(prevTournament => {
        const updatedGroups = prevTournament.groups.map(group => {
          if (group.id === groupId) {
            // Update racers in this group with current points
            const updatedGroupRacers = group.racers.map(groupRacer => {
              const updatedRacer = updatedRacers.find(r => r.id === groupRacer.id);
              return updatedRacer || groupRacer;
            });
            
            return { 
              ...group, 
              isCompleted: true, 
              results,
              racers: updatedGroupRacers
            };
          }
          return group;
        });

        return { 
          ...prevTournament, 
          groups: updatedGroups,
          isActive: true
        };
      });

      return updatedRacers;
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