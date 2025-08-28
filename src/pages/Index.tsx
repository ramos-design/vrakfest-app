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
import { RacerOverview } from '@/components/RacerOverview';
import { Statistics } from '@/components/Statistics';
import { Events } from '@/components/Events';
import { Communication } from '@/components/Communication';
import { RaceRules } from '@/components/RaceRules';
import { ActionLog } from '@/components/ActionLog';
import { Marketplace } from '@/components/Marketplace';
import { useRacingTournament } from '@/hooks/useRacingTournament';
import { Racer } from '@/types/racing';
import { TournamentSettings, defaultTournamentSettings } from '@/types/tournamentSettings';

const Index = () => {
  const [activeTab, setActiveTab] = useState('jezdci');
  const [editingRacer, setEditingRacer] = useState<Racer | null>(null);
  const [tournamentSettings, setTournamentSettings] = useState<TournamentSettings>(defaultTournamentSettings);

  const {
    racers,
    tournament,
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
    addRacersToGroup
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

  const handleViewTournament = () => {
    setActiveTab('turnaj');
  };

  const handleStartTournament = () => {
    setActiveTab('turnaj');
    startTournament(tournamentSettings);
  };

  const handleSettingsChange = (settings: TournamentSettings) => {
    setTournamentSettings(settings);
  };

  const handleViewControl = () => {
    setActiveTab('kontrola');
  };

  const handleViewCommunication = () => {
    setActiveTab('komunikace');
  };

  const handleViewStatistics = () => {
    setActiveTab('bodove-poradei');
  };

  const handleViewMarketplace = () => {
    setActiveTab('bazar');
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
                showActions={false}
              />
            </div>
            
            <div className="space-y-6">              
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
            onStartTournament={handleStartTournament}
            tournamentSettings={tournamentSettings}
            onSettingsChange={handleSettingsChange}
            onAddRacersToGroup={addRacersToGroup}
            onSwitchToControl={handleViewControl}
          />
        );
      
      case 'kontrola':
        return (
          <RaceControl
            currentGroup={currentRaceGroup}
            onCompleteRace={completeRace}
          />
        );
      
      case 'bodove-poradei':
        return (
          <Statistics
            racers={racers}
            tournament={tournament}
          />
        );
      
      case 'statistiky':
        return (
          <RacerOverview
            racers={racers}
            onEdit={handleEditRacer}
            onDelete={deleteRacer}
            onDeactivate={deactivateRacer}
            onActivate={activateRacer}
            onSave={handleSaveRacer}
            onCancel={handleCancelEdit}
            editingRacer={editingRacer}
          />
        );
      
      case 'udalosti':
        return <Events />;
      
      case 'komunikace':
        return <Communication />;
      
      case 'pravidla':
        return <RaceRules />;
      
      case 'log-akci':
        return <ActionLog />;
      
      case 'bazar':
        return <Marketplace />;
      
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RacerTable
                racers={racers}
                onEdit={handleEditRacer}
                onDelete={deleteRacer}
                showActions={false}
              />
            </div>
            
            <div className="space-y-6">              
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
                onViewTournament={handleViewTournament}
                onViewControl={handleViewControl}
                onViewCommunication={handleViewCommunication}
                onViewStatistics={handleViewStatistics}
                onViewMarketplace={handleViewMarketplace}
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