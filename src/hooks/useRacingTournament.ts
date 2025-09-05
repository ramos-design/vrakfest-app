import { useState, useCallback } from 'react';
import { Racer, Tournament, RaceGroup, RaceResult, RacerCategory } from '@/types/racing';
import { createGroups, shouldAdvanceRacer, categories, generateRealRacers } from '@/utils/racingUtils';
import { TournamentSettings } from '@/types/tournamentSettings';

export const useRacingTournament = () => {
  const [racers, setRacers] = useState<Racer[]>(() => generateRealRacers());
  const [demolitionDerbyRacers, setDemolitionDerbyRacers] = useState<string[]>([]);
  const [tournamentSettings, setTournamentSettings] = useState<TournamentSettings | null>(null);
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

  const deactivateRacer = useCallback((id: string) => {
    setRacers(prev => prev.map(racer => 
      racer.id === id ? { ...racer, isActive: false } : racer
    ));
  }, []);

  const activateRacer = useCallback((id: string) => {
    setRacers(prev => prev.map(racer => 
      racer.id === id ? { ...racer, isActive: true } : racer
    ));
  }, []);

  const startTournament = useCallback((settings?: TournamentSettings) => {
    const activeRacers = racers.filter(r => r.isActive);
    if (activeRacers.length === 0) return;

    // Store tournament settings
    if (settings) {
      setTournamentSettings(settings);
    }

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

      // Check if all groups in current round and category are completed
      const currentRoundGroups = updatedGroups.filter(g => 
        g.category === prev.currentCategory && g.round === prev.currentRound
      );
      const allCurrentRoundCompleted = currentRoundGroups.every(g => g.isCompleted);
      
      let newRound = prev.currentRound;
      let newCategory = prev.currentCategory;
      let newGroups = updatedGroups;

      if (allCurrentRoundCompleted) {
        // All groups in current round completed, advance to next round
        newRound = prev.currentRound + 1;
        console.log(`All groups in round ${prev.currentRound} completed, advancing to round ${newRound}`);
        
        // Get active racers for the next round
        const activeRacersForNextRound = racers.filter(r => 
          r.isActive && r.category === prev.currentCategory
        );
        
        if (activeRacersForNextRound.length > 0) {
          // Create new groups for the next round
          const nextRoundGroups = createGroups(
            activeRacersForNextRound, 
            prev.currentCategory, 
            newRound
          );
          newGroups = [...updatedGroups, ...nextRoundGroups];
          console.log(`Created ${nextRoundGroups.length} groups for round ${newRound}`);
        }
      }

      const newTournamentState = { 
        ...prev, 
        currentRound: newRound,
        currentCategory: newCategory,
        groups: newGroups
      };
      
      console.log('New tournament state:', newTournamentState);
      return newTournamentState;
    });
  }, [racers]);

  const updateTournamentSettings = useCallback((newSettings: TournamentSettings) => {
    setTournamentSettings(newSettings);
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
    console.log('Adding racers to group:', { groupId, racerIds });
    
    setTournament(prev => ({
      ...prev,
      groups: prev.groups.map(group => {
        if (group.id === groupId) {
          // Find the racers to add
          const racersToAdd = racers.filter(r => racerIds.includes(r.id));
          console.log('Racers to add:', racersToAdd);
          return {
            ...group,
            racers: [...group.racers, ...racersToAdd]
          };
        }
        return group;
      })
    }));
    
    // Also mark these racers as active in the tournament
    setRacers(prev => prev.map(racer => 
      racerIds.includes(racer.id) ? { ...racer, isActive: true } : racer
    ));
  }, [racers]);

  const addToDemolitionDerby = useCallback((racerId: string) => {
    setDemolitionDerbyRacers(prev => {
      if (!prev.includes(racerId)) {
        return [...prev, racerId];
      }
      return prev;
    });
  }, []);

  const removeFromDemolitionDerby = useCallback((racerId: string) => {
    setDemolitionDerbyRacers(prev => prev.filter(id => id !== racerId));
  }, []);

  return {
    racers,
    tournament,
    tournamentSettings,
    demolitionDerbyRacers,
    addRacer,
    updateRacer,
    deleteRacer,
    deactivateRacer,
    activateRacer,
    startTournament,
    startRace,
    completeRace,
    resetTournament,
    getCurrentRaceGroup,
    addRacersToGroup,
    addToDemolitionDerby,
    removeFromDemolitionDerby,
    updateTournamentSettings
  };
};