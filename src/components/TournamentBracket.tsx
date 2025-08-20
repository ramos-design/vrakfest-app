import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Trophy, Clock } from 'lucide-react';
import { RaceGroup, Tournament, Racer } from '@/types/racing';
import { getCategoryBadgeColor, getCategoryColor } from '@/utils/racingUtils';
import { TournamentSettings } from '@/components/TournamentSettings';
import { TournamentSettings as ITournamentSettings } from '@/types/tournamentSettings';

interface TournamentBracketProps {
  tournament: Tournament;
  racers: Racer[];
  onStartRace: (groupId: string) => void;
  onStartTournament: () => void;
  tournamentSettings: ITournamentSettings;
  onSettingsChange: (settings: ITournamentSettings) => void;
}

export const TournamentBracket = ({ tournament, racers, onStartRace, onStartTournament, tournamentSettings, onSettingsChange }: TournamentBracketProps) => {
  const activeRacers = racers.filter(r => r.isActive);
  const currentCategoryGroups = tournament.groups.filter(g => 
    g.category === tournament.currentCategory && g.round === tournament.currentRound
  );
  
  const nextGroup = currentCategoryGroups.find(g => !g.hasStarted);
  const currentGroup = currentCategoryGroups.find(g => g.hasStarted && !g.isCompleted);

  if (!tournament.isActive) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="racing-gradient bg-clip-text text-transparent">
            Turnajový pavouk
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <Trophy className="w-16 h-16 mx-auto text-primary" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Připraveno {activeRacers.length} jezdců</h3>
              <p className="text-muted-foreground mb-2">
                Skupiny po 6 jezdcích, celkem {Math.ceil(activeRacers.length / 6)} skupin
              </p>
              <div className="flex justify-center gap-2 mb-4">
                {['do 1.6L', 'nad 1.6L', 'Ženy'].map(category => {
                  const count = activeRacers.filter(r => r.category === category).length;
                  return (
                    <Badge key={category} className={`${getCategoryBadgeColor(category as any)} text-white`}>
                      {category}: {count} jezdců
                    </Badge>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <TournamentSettings 
                settings={tournamentSettings}
                onSettingsChange={onSettingsChange}
              />
              <Button onClick={onStartTournament} className="racing-gradient shadow-racing" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Zahájit turnaj
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle className="racing-gradient bg-clip-text text-transparent text-2xl">
            Turnajový závod
          </CardTitle>
          <Badge variant="outline" className="text-base px-3 py-1">
            Kolo {tournament.currentRound}
          </Badge>
          <Badge className={`${getCategoryBadgeColor(tournament.currentCategory)} text-white text-base px-3 py-1`}>
            {tournament.currentCategory}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {currentGroup && (
          <div className="mb-6 p-4 rounded-lg bg-racing-yellow">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-racing-black" />
              <span className="font-semibold text-racing-black">Právě jede:</span>
            </div>
            <RaceGroupCard group={currentGroup} isCurrentRace={true} onStartRace={onStartRace} />
          </div>
        )}

        <div className="space-y-4">
          {currentCategoryGroups
            .filter(group => group !== currentGroup)
            .map((group, index) => (
              <RaceGroupCard
                key={group.id}
                group={group}
                isNext={group === nextGroup}
                onStartRace={onStartRace}
              />
            ))}
        </div>

        {currentCategoryGroups.length === 0 && (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto text-primary mb-4" />
            <p className="text-muted-foreground">Zatím žádní jezdci</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface RaceGroupCardProps {
  group: RaceGroup;
  isNext?: boolean;
  isCurrentRace?: boolean;
  onStartRace: (groupId: string) => void;
}

const RaceGroupCard = ({ group, isNext, isCurrentRace, onStartRace }: RaceGroupCardProps) => {
  const getStatusBadge = () => {
    if (group.isCompleted) return <Badge className="bg-green-600 text-white">Dokončeno</Badge>;
    if (group.hasStarted) return <Badge className="bg-yellow-600 text-white">Probíhá</Badge>;
    if (isNext) return <Badge className="bg-blue-600 text-white">Na řadě</Badge>;
    return <Badge variant="outline">Čeká</Badge>;
  };

  return (
    <Card className={`transition-racing ${isCurrentRace ? 'ring-2 ring-primary' : ''} ${
      group.isCompleted ? 'bg-muted/50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">
              Skupina {group.id.split('group')[1]}
            </CardTitle>
            <Badge className={`${getCategoryBadgeColor(group.category)} text-white`}>
              {group.category}
            </Badge>
            <Badge variant="outline">Kolo {group.round}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {!group.hasStarted && (
              <Button 
                onClick={() => onStartRace(group.id)} 
                className="racing-gradient shadow-racing"
                disabled={!isNext}
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {group.racers.map((racer, index) => {
            // Najdi skutečné body přidělené v tomto kole
            const roundPoints = group.results?.find(r => r.racerId === racer.id)?.points || 0;
            
            return (
              <div key={racer.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                <Badge variant="outline" className="font-mono">
                  #{index + 1}
                </Badge>
                <span className="text-sm font-medium">
                  {racer.firstName} {racer.lastName}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  {group.isCompleted && roundPoints > 0 && (
                    <Badge className="bg-green-600 text-white font-mono text-xs">
                      +{roundPoints}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="font-mono">
                    {racer.points}b
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};