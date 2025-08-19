import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardActions } from '@/components/DashboardActions';
import { DashboardStats } from '@/components/DashboardStats';
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

  // Listen for redirect to tournament event
  useEffect(() => {
    const handleRedirect = () => {
      setActiveTab('turnaj');
    };
    
    window.addEventListener('redirectToTournament', handleRedirect);
    return () => window.removeEventListener('redirectToTournament', handleRedirect);
  }, []);

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

  const handleStartTournament = () => {
    setActiveTab('turnaj');
    startTournament();
  };

  const handleViewControl = () => {
    setActiveTab('kontrola');
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'jezdci':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RacerTable
                  racers={racers}
                  onEdit={handleEditRacer}
                  onDelete={deleteRacer}
                />
              </div>
              
              <div className="space-y-6">
                <RacerForm
                  racer={editingRacer}
                  onSave={handleSaveRacer}
                  onCancel={handleCancelEdit}
                  compact={true}
                />
                
                <DashboardStats
                  racerCount={racers.length}
                  activeRacerCount={activeRacers.length}
                  tournamentProgress={tournament?.currentRound || 0}
                />
              </div>
            </div>
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
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RacerTable
                racers={racers}
                onEdit={handleEditRacer}
                onDelete={deleteRacer}
              />
            </div>
            
            <div className="space-y-6">
              <RacerForm
                racer={editingRacer}
                onSave={handleSaveRacer}
                onCancel={handleCancelEdit}
                compact={true}
              />
              
              <DashboardStats
                racerCount={racers.length}
                activeRacerCount={activeRacers.length}
                tournamentProgress={tournament?.currentRound || 0}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader
            racerCount={racers.length}
            activeRacerCount={activeRacers.length}
            onReset={resetTournament}
          />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              <DashboardActions 
                onStartTournament={handleStartTournament}
                onViewControl={handleViewControl}
                isTournamentActive={tournament.isActive}
              />
              {renderMainContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;