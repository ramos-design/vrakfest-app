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
  const [showRacerForm, setShowRacerForm] = useState(false);
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

  const handleAddRacer = () => {
    setEditingRacer(null);
    setShowRacerForm(true);
  };

  const handleEditRacer = (racer: Racer) => {
    setEditingRacer(racer);
    setShowRacerForm(true);
  };

  const handleSaveRacer = (racerData: Omit<Racer, 'id'>) => {
    if (editingRacer) {
      updateRacer(editingRacer.id, racerData);
    } else {
      addRacer(racerData);
    }
    setShowRacerForm(false);
    setEditingRacer(null);
  };

  const handleCancelRacerForm = () => {
    setShowRacerForm(false);
    setEditingRacer(null);
  };

  const renderContent = () => {
    if (showRacerForm) {
      return (
        <RacerForm
          racer={editingRacer}
          onSave={handleSaveRacer}
          onCancel={handleCancelRacerForm}
        />
      );
    }

    switch (activeTab) {
      case 'jezdci':
        return (
          <RacerTable
            racers={racers}
            onEdit={handleEditRacer}
            onDelete={deleteRacer}
            onAdd={handleAddRacer}
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
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;