import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { RacerTable } from '@/components/RacerTable';
import { RacerForm } from '@/components/RacerForm';
import { TournamentBracket } from '@/components/TournamentBracket';
import { RaceControl } from '@/components/RaceControl';
import { Statistics } from '@/components/Statistics';
import { useRacingTournament } from '@/hooks/useRacingTournament';
import { Racer } from '@/types/racing';

const Index = () => {
  const [activeTab, setActiveTab] = useState('jezdci');
  const [editingRacer, setEditingRacer] = useState<Racer | null>(null);

  const {
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
  } = useRacingTournament();

  const activeRacers = racers.filter(r => r.isActive);
  const currentRaceGroup = getCurrentRaceGroup();

  const handleEditRacer = (racer: Racer) => {
    setEditingRacer(racer);
  };

  const handleSaveRacer = (racerData: Omit<Racer, 'id'>) => {
    if (editingRacer) {
      updateRacer(editingRacer.id, racerData);
      setEditingRacer(null);
    } else {
      addRacer(racerData);
    }
  };

  const handleCancelEdit = () => {
    setEditingRacer(null);
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'jezdci':
        return (
          <RacerTable
            racers={racers}
            onEdit={handleEditRacer}
            onDelete={deleteRacer}
          />
        );
      
      case 'turnaj':
        return (
          <TournamentBracket
            tournament={tournament}
            racers={racers}
            onStartRace={startRace}
            onStartTournament={startTournament}
          />
        );
      
      case 'kontrola':
        return (
          <RaceControl
            currentGroup={currentRaceGroup}
            onCompleteRace={completeRace}
          />
        );
      
      case 'statistiky':
        return (
          <Statistics
            racers={racers}
            tournament={tournament}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        racerCount={racers.length}
        activeRacerCount={activeRacers.length}
        onReset={resetTournament}
      />
      
      <div className="flex">
        {/* Sidebar with form */}
        <div className="w-96 bg-card border-r border-border p-6">
          <RacerForm
            racer={editingRacer}
            onSave={handleSaveRacer}
            onCancel={handleCancelEdit}
            compact={true}
          />
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;