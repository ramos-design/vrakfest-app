import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flag, Trophy, Clock } from 'lucide-react';
import { RaceGroup, Tournament, Racer } from '@/types/racing';
import { getCategoryBadgeColor, getCategoryColor } from '@/utils/racingUtils';
import { TournamentSettings } from '@/components/TournamentSettings';
import { TournamentSettings as ITournamentSettings } from '@/types/tournamentSettings';
import { IncompleteGroupDialog } from '@/components/IncompleteGroupDialog';

interface TournamentBracketProps {
  tournament: Tournament;
  racers: Racer[];
  onStartRace: (groupId: string) => void;
  onStartTournament: () => void;
  tournamentSettings: ITournamentSettings;
  onSettingsChange: (settings: ITournamentSettings) => void;
  onAddRacersToGroup: (groupId: string, racerIds: string[]) => void;
  onSwitchToControl: () => void;
  onAddRacerToTournament: (racerId: string) => void;
  viewOnly?: boolean;
}

export const TournamentBracket = ({
  tournament,
  racers,
  onStartRace,
  onStartTournament,
  tournamentSettings,
  onSettingsChange,
  onAddRacersToGroup,
  onSwitchToControl,
  onAddRacerToTournament,
  viewOnly = false
}: TournamentBracketProps) => {
  const [incompleteGroupDialog, setIncompleteGroupDialog] = useState<{
    isOpen: boolean;
    group: RaceGroup | null;
  }>({ isOpen: false, group: null });

  const activeRacers = racers.filter(r => r.isActive);
  const availableRacers = racers.filter(r => !r.isActive);
  const currentCategoryGroups = tournament.groups.filter(g =>
    g.category === tournament.currentCategory && g.round === tournament.currentRound
  );

  const nextGroup = currentCategoryGroups.find(g => !g.hasStarted);
  const currentGroup = currentCategoryGroups.find(g => g.hasStarted && !g.isCompleted);

  // Logic for "Preparing" group - usually the one after nextGroup if current exists
  const nextGroupIndex = currentCategoryGroups.findIndex(g => g === nextGroup);
  const preparingGroup = nextGroupIndex !== -1 ? currentCategoryGroups[nextGroupIndex + 1] : null;

  const getTrackName = () => {
    switch (tournamentSettings.selectedTrack) {
      case 'ostrava':
        return 'Ostrava - Vřesinská strž';
      case 'hrachovec':
        return 'Hrachovec - areál Ekorema';
      case 'branky':
        return 'Ostrava - Vřesinská strž';
      default:
        return 'Ostrava - Vřesinská strž';
    }
  };

  // Find available racers for incomplete group dialog
  const getAvailableRacersForGroup = (group: RaceGroup) => {
    // First try to get fresh racers (not in other groups)
    const freshRacers = racers.filter(r =>
      r.isActive &&
      r.category === group.category &&
      !group.racers.some(gr => gr.id === r.id) && // Not already in this group
      !tournament.groups.some(g => g.id !== group.id && g.racers.some(gr => gr.id === r.id)) // Not in other groups
    );

    // If no fresh racers available, allow all racers from same category (except those already in this group)
    if (freshRacers.length === 0) {
      return racers.filter(r =>
        r.isActive &&
        r.category === group.category &&
        !group.racers.some(gr => gr.id === r.id) // Not already in this group
      );
    }

    return freshRacers;
  };

  const handleStartRace = (groupId: string) => {
    const group = tournament.groups.find(g => g.id === groupId);
    if (!group) return;

    // Check if group is incomplete
    if (group.racers.length < tournamentSettings.racersPerGroup) {
      setIncompleteGroupDialog({ isOpen: true, group });
      return;
    }

    // Start race normally
    onStartRace(groupId);

    // Automatically switch to control tab when race starts
    onSwitchToControl();
  };

  const handleContinueWithCurrentSize = () => {
    if (incompleteGroupDialog.group) {
      onStartRace(incompleteGroupDialog.group.id);
    }
  };

  const handleAddRacersAndStart = (racerIds: string[]) => {
    if (incompleteGroupDialog.group) {
      onAddRacersToGroup(incompleteGroupDialog.group.id, racerIds);
      // Start the race after adding racers
      setTimeout(() => {
        onStartRace(incompleteGroupDialog.group!.id);
        onSwitchToControl();
      }, 100);
    }
  };

  if (!tournament.isActive) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 p-6 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bebas text-5xl text-white tracking-wide uppercase leading-none">
              {tournamentSettings.tournamentName}
            </h1>
            <div className="h-1 w-20 bg-racing-yellow mt-2"></div>
          </div>
          <div className="bg-racing-yellow text-black px-4 py-2 font-bebas text-xl">
            <span>LOCATION: {getTrackName().toUpperCase()}</span>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/30 border border-white/10 p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto text-racing-yellow mb-2" />
              <div className="font-bebas text-3xl text-white">{activeRacers.length}</div>
              <div className="font-tech text-xs text-white/50 uppercase tracking-widest">Registrovaní jezdci</div>
            </div>
            <div className="bg-black/30 border border-white/10 p-4 text-center">
              <Flag className="w-8 h-8 mx-auto text-racing-yellow mb-2" />
              <div className="font-bebas text-3xl text-white">{Math.ceil(activeRacers.length / tournamentSettings.racersPerGroup)}</div>
              <div className="font-tech text-xs text-white/50 uppercase tracking-widest">Závodní skupiny</div>
            </div>
            <div className="bg-black/30 border border-white/10 p-4 text-center">
              <Clock className="w-8 h-8 mx-auto text-racing-yellow mb-2" />
              <div className="font-bebas text-3xl text-white">~4h</div>
              <div className="font-tech text-xs text-white/50 uppercase tracking-widest">Odhadovaná délka</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {['do 1.6L', 'nad 1.6L', 'Ženy'].map(category => {
              const count = activeRacers.filter(r => r.category === category).length;
              return (
                <Badge key={category} className={`${getCategoryBadgeColor(category as any)} text-white border-none rounded-none px-4 py-2`}>
                  <span className="font-tech uppercase text-xs tracking-wider">{category}: {count} jezdců</span>
                </Badge>
              );
            })}
          </div>

          {/* Inline Tournament Settings */}
          {!viewOnly && (
            <div className="bg-black/20 border border-white/5 p-4">
              <TournamentSettings
                settings={tournamentSettings}
                onSettingsChange={onSettingsChange}
                availableRacers={availableRacers}
                onAddRacer={onAddRacerToTournament}
                inline={true}
              />
            </div>
          )}

          <div className="flex justify-center pt-4">
            {!viewOnly ? (
              <Button onClick={onStartTournament} className="bg-racing-yellow text-black hover:bg-white font-bebas text-2xl px-12 py-6 shadow-[0_0_30px_rgba(244,206,20,0.3)] hover:shadow-[0_0_50px_rgba(244,206,20,0.6)] transition-all duration-300">
                <span className="flex items-center gap-3">
                  <Flag className="w-6 h-6" />
                  INITIATE TOURNAMENT PROTOCOL
                </span>
              </Button>
            ) : (
              <div className="bg-black/40 border border-white/10 px-8 py-4 text-white/40 font-tech uppercase tracking-[0.2em]">
                Tournament Standby Mode
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <div className="bg-[#1a1a1a] border border-white/10 p-6 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="font-bebas text-4xl text-white tracking-wide uppercase leading-none">{tournamentSettings.tournamentName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-racing-yellow animate-pulse"></div>
                <span className="font-tech text-xs text-racing-yellow uppercase tracking-[0.2em]">Živý přenos turnaje</span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-white/10"></div>

            <div className="flex gap-2">
              <Badge variant="outline" className="text-white border-white/20 rounded-none font-tech uppercase tracking-wider">
                <span>{tournament.currentRound <= tournamentSettings.numberOfQualifyingRounds ? `KVALIFIKACE - KOLO ${tournament.currentRound}` : `FINÁLE - KOLO ${tournament.currentRound}`}</span>
              </Badge>
              <Badge className={`${getCategoryBadgeColor(tournament.currentCategory)} text-white border-0 rounded-none font-tech uppercase tracking-wider`}>
                <span>{tournament.currentCategory}</span>
              </Badge>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 px-4 py-2">
            <span className="text-white/50 font-tech uppercase text-xs tracking-widest block">
              📍 MÍSTO: {getTrackName().toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Race Status HUD - Dual Stage (Compact Version) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CURRENT - NA TRATI */}
        <div className={`relative overflow-hidden p-4 border-l-4 ${currentGroup ? 'bg-racing-yellow border-black shadow-[0_10px_30px_rgba(244,206,20,0.2)]' : 'bg-black/40 border-white/5 opacity-40'}`}>
          {currentGroup && (
            <div className="absolute top-0 right-0 px-2 py-0.5 bg-black text-racing-yellow font-bebas text-xs tracking-widest animate-pulse">
              LIVE
            </div>
          )}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${currentGroup ? 'bg-black animate-ping' : 'bg-white/20'}`}></div>
              <h3 className={`font-bebas text-xl tracking-widest uppercase ${currentGroup ? 'text-black' : 'text-white/40'}`}>
                NA TRATI / ZÁVODÍ
              </h3>
            </div>

            {currentGroup ? (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-black/60 font-tech text-[10px] uppercase font-bold">SKUPINA:</span>
                  <span className="text-black font-bebas text-3xl">{currentGroup.id.split('group')[1]}</span>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {currentGroup.racers.map(r => (
                    <div key={r.id} className="bg-black text-white px-3 py-1.5 flex items-center justify-between border-r-2 border-racing-yellow">
                      <div className="flex items-center gap-3">
                        <span className="text-racing-yellow font-bebas text-2xl leading-none w-10">#{r.startNumber}</span>
                        <div className="flex flex-col leading-tight">
                          <span className="font-bebas text-lg tracking-wider uppercase">{r.firstName} {r.lastName}</span>
                          <span className="font-tech text-[9px] text-white/40 uppercase">{r.vehicleType}</span>
                        </div>
                      </div>
                      <Flag className="w-5 h-5 text-racing-yellow" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center border border-white/5 border-dashed rounded bg-black/10">
                <Clock className="w-6 h-6 text-white/10 mb-2" />
                <span className="font-tech text-xs text-white/20 uppercase tracking-widest">Trať je volná</span>
              </div>
            )}
          </div>
        </div>

        {/* NEXT - PŘÍPRAVA NA START */}
        <div className={`relative overflow-hidden p-4 border-l-4 ${nextGroup ? 'bg-orange-600 border-orange-900 shadow-[0_10px_30px_rgba(234,88,12,0.15)]' : 'bg-black/40 border-white/5 opacity-40'}`}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${nextGroup ? 'bg-white animate-pulse' : 'bg-white/20'}`}></div>
              <h3 className={`font-bebas text-xl tracking-widest uppercase ${nextGroup ? 'text-white' : 'text-white/40'}`}>
                PŘÍPRAVA NA START
              </h3>
            </div>

            {nextGroup ? (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-white/70 font-tech text-[10px] uppercase font-bold">SKUPINA:</span>
                  <span className="text-white font-bebas text-3xl">{nextGroup.id.split('group')[1]}</span>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {nextGroup.racers.map(r => (
                    <div key={r.id} className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 flex items-center gap-3">
                      <span className="text-white font-bebas text-2xl leading-none w-10">#{r.startNumber}</span>
                      <div className="flex flex-col leading-tight">
                        <span className="font-bebas text-lg tracking-wider uppercase text-white">{r.firstName} {r.lastName}</span>
                        <span className="font-tech text-[9px] text-white/40 uppercase">{r.vehicleType}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 bg-black/30 p-2 border-l-2 border-white/20">
                  <p className="text-[9px] font-tech text-white uppercase tracking-widest">
                    ⚠️ dostavte se neprodleně do startovního prostoru.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center border border-white/5 border-dashed rounded bg-black/10">
                <span className="font-tech text-xs text-white/20 uppercase tracking-widest">Program dokončen</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Race Groups Grid */}
      <div className="grid grid-cols-1 gap-6">
        {currentCategoryGroups
          .sort((a, b) => {
            const getGroupNumber = (groupId: string) => {
              const match = groupId.match(/group(\d+)$/);
              return match ? parseInt(match[1], 10) : 0;
            };
            return getGroupNumber(a.id) - getGroupNumber(b.id);
          })
          .map((group, index) => (
            <RaceGroupCard
              key={group.id}
              group={group}
              tournament={tournament}
              isNext={group === nextGroup}
              isCurrentRace={group === currentGroup}
              onStartRace={handleStartRace}
              numberOfQualifyingRounds={tournamentSettings.numberOfQualifyingRounds}
              viewOnly={viewOnly}
            />
          ))}
      </div>

      {currentCategoryGroups.length === 0 && (
        <div className="bg-[#1a1a1a] border border-white/10 p-12 text-center">
          <div>
            <Trophy className="w-16 h-16 mx-auto text-white/20 mb-4" />
            <p className="text-white/40 font-tech uppercase tracking-widest">Žádné aktivní skupiny</p>
          </div>
        </div>
      )}

      {/* Driver Standby Mode */}
      {viewOnly && !tournament.isActive && (
        <div className="text-center py-10 bg-black/20 border border-white/5">
          <p className="text-white/40 font-tech uppercase tracking-widest">Sledujte program, brzy startujeme!</p>
        </div>
      )}

      {!viewOnly && incompleteGroupDialog.group && (
        <IncompleteGroupDialog
          isOpen={incompleteGroupDialog.isOpen}
          onClose={() => setIncompleteGroupDialog({ isOpen: false, group: null })}
          group={incompleteGroupDialog.group}
          targetGroupSize={tournamentSettings.racersPerGroup}
          availableRacers={getAvailableRacersForGroup(incompleteGroupDialog.group)}
          onContinueWithCurrentSize={handleContinueWithCurrentSize}
          onAddRacersAndStart={handleAddRacersAndStart}
          minimumRacers={5}
          tournament={tournament}
        />
      )}
    </div>
  );
};

interface RaceGroupCardProps {
  group: RaceGroup;
  tournament: Tournament;
  isNext?: boolean;
  isCurrentRace?: boolean;
  onStartRace: (groupId: string) => void;
  numberOfQualifyingRounds: number;
  viewOnly?: boolean;
}

const RaceGroupCard = ({ group, tournament, isNext, isCurrentRace, onStartRace, numberOfQualifyingRounds, viewOnly = false }: RaceGroupCardProps) => {
  const getStatusBadge = () => {
    if (group.isCompleted) return <Badge className="bg-green-600/20 text-green-500 border border-green-500/50 rounded-none font-tech uppercase text-[10px] tracking-wider"><span>DOKONČENO</span></Badge>;
    if (group.hasStarted) return <Badge className="bg-racing-yellow/20 text-racing-yellow border border-racing-yellow/50 rounded-none font-tech uppercase text-[10px] tracking-wider"><span>PROBÍHÁ</span></Badge>;
    if (isNext) return <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded-none font-tech uppercase text-[10px] tracking-wider"><span>PŘÍŠTÍ</span></Badge>;
    return <Badge variant="outline" className="border-white/20 text-white/40 rounded-none font-tech uppercase text-[10px] tracking-wider"><span>ČEKÁ</span></Badge>;
  };

  return (
    <div className={`relative transition-all duration-300 ${isCurrentRace
      ? 'border-l-4 border-racing-yellow bg-gradient-to-r from-racing-yellow/10 to-transparent'
      : group.isCompleted ? 'opacity-60 grayscale' : 'border-l-4 border-white/10 hover:border-white/30'
      }`}>
      <div className="bg-[#111] border-y border-r border-white/10 p-4 relative overflow-hidden group">

        {/* Background Grid for Card */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#222] flex items-center justify-center border border-white/10">
              <span className="font-bebas text-2xl text-white">{group.id.split('group')[1]}</span>
            </div>
            <div>
              <h3 className="font-bebas text-xl text-white tracking-wide">SKUPINA {group.id.split('group')[1]} - KONFIGURACE</h3>
              <div className="flex gap-2 mt-1">
                <span className="text-white/40 font-tech text-[10px] uppercase tracking-wider">KATEGORIE {group.category}</span>
                <span className="text-white/20 font-tech text-[10px] uppercase tracking-wider">|</span>
                <span className="text-white/40 font-tech text-[10px] uppercase tracking-wider">{group.round}. KOLO</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {getStatusBadge()}
            {!viewOnly && !group.hasStarted && isNext && (
              <Button
                onClick={() => onStartRace(group.id)}
                className="bg-racing-yellow text-black hover:bg-white font-bebas tracking-wide shadow-[0_0_15px_rgba(244,206,20,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all"
              >
                <span className="flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  INITIATE RACE SEQUENCE
                </span>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {group.racers.map((racer, index) => (
            <div key={racer.id} className="bg-black/40 border border-white/5 p-2 flex items-center justify-between group/racer hover:border-racing-yellow/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="font-mono text-xs text-white/30">#{index + 1}</div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-white group-hover/racer:text-racing-yellow transition-colors uppercase font-bebas tracking-wide">{racer.firstName} {racer.lastName}</span>
                  <span className="text-[10px] text-white/40 font-tech uppercase">{racer.vehicleType}</span>
                </div>
              </div>
              {/* Points display logic would go here if needed */}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};