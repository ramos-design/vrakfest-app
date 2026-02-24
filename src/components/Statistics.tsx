import React, { useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, TrendingUp, Medal, Calendar } from 'lucide-react';
import { Racer, RacerCategory, Tournament } from '@/types/racing';
import { categories, getCategoryBadgeColor } from '@/utils/racingUtils';

interface StatisticsProps {
  racers: Racer[];
  tournament: Tournament;
}

export const Statistics = React.memo(({ racers, tournament }: StatisticsProps) => {
  const [selectedView, setSelectedView] = React.useState<'current-tournament' | 'overall-overview' | 'overall-top' | 'historical'>('current-tournament');

  const activeRacers = useMemo(() => racers.filter(r => r.isActive), [racers]);

  // Calculate tournament points (points gained only from current tournament)
  const getTournamentPoints = useCallback((racerId: string): number => {
    if (!tournament || !tournament.groups) return 0;

    return tournament.groups.reduce((totalPoints, group) => {
      if (!group.results || !group.isCompleted) return totalPoints;

      const result = group.results.find(r => r.racerId === racerId);
      return totalPoints + (result ? result.points : 0);
    }, 0);
  }, [tournament]);

  const getTournamentRacersByCategory = useCallback((category: RacerCategory) => {
    return activeRacers
      .filter(r => r.category === category)
      .map(racer => ({
        ...racer,
        tournamentPoints: getTournamentPoints(racer.id)
      }))
      .sort((a, b) => b.tournamentPoints - a.tournamentPoints);
  }, [activeRacers, getTournamentPoints]);

  // For overall views, use ALL racers (not just active ones) to show historical data
  const overallTop = useMemo(() => {
    return [...racers]
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
  }, [racers]);

  const renderCurrentTournament = () => (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Pořadí v aktuálním turnaji</h3>
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="data-[state=active]:bg-racing-yellow data-[state=active]:text-racing-black">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map(category => {
          const categoryRacers = getTournamentRacersByCategory(category);
          return (
            <TabsContent key={category} value={category}>
              {categoryRacers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Jezdec</TableHead>
                      <TableHead>Vozidlo</TableHead>
                      <TableHead className="text-right">Body v turnaji</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryRacers.map((racer, index) => (
                      <TableRow key={racer.id} className="transition-racing hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center">
                            {index < 3 && (
                              <Trophy className={`w-4 h-4 mr-1 ${index === 0 ? 'text-yellow-500' :
                                index === 1 ? 'text-gray-400' : 'text-amber-600'
                                }`} />
                            )}
                            <span className="font-mono font-bold">{index + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {racer.firstName} {racer.lastName}
                          <div className="text-sm text-muted-foreground">#{racer.startNumber}</div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {racer.vehicleType}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="font-mono font-bold text-lg">
                            {racer.tournamentPoints}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Žádní jezdci v této kategorii
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );

  const renderOverallOverview = () => (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Celkový přehled bodů všech jezdců</h3>
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="data-[state=active]:bg-racing-yellow data-[state=active]:text-racing-black">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map(category => {
          // For overall overview, show ALL racers (including inactive) to display historical data
          const categoryRacers = racers
            .filter(r => r.category === category)
            .sort((a, b) => b.points - a.points);
          return (
            <TabsContent key={category} value={category}>
              {/* Always show table for overall overview, even if empty, to display historical data */}
              {true ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Jezdec</TableHead>
                      <TableHead>Vozidlo</TableHead>
                      <TableHead className="text-right">Celkové body</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryRacers.length > 0 ? categoryRacers.map((racer, index) => (
                      <TableRow key={racer.id} className="transition-racing hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center">
                            {index < 3 && (
                              <Trophy className={`w-4 h-4 mr-1 ${index === 0 ? 'text-yellow-500' :
                                index === 1 ? 'text-gray-400' : 'text-amber-600'
                                }`} />
                            )}
                            <span className="font-mono font-bold">{index + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {racer.firstName} {racer.lastName}
                          <div className="text-sm text-muted-foreground">#{racer.startNumber}</div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {racer.vehicleType}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="font-mono font-bold text-lg">
                            {racer.points}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Žádní jezdci v této kategorii
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : null}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );

  const renderOverallTop = () => (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Celkové pořadí - TOP 10</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Jezdec</TableHead>
            <TableHead>Kategorie</TableHead>
            <TableHead>Vozidlo</TableHead>
            <TableHead className="text-right">Body</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {overallTop.map((racer, index) => (
            <TableRow key={racer.id} className="transition-racing hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center">
                  {index < 3 && (
                    <Trophy className={`w-4 h-4 mr-1 ${index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' : 'text-amber-600'
                      }`} />
                  )}
                  <span className="font-mono font-bold">{index + 1}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {racer.firstName} {racer.lastName}
                <div className="text-sm text-muted-foreground">#{racer.startNumber}</div>
              </TableCell>
              <TableCell>
                <Badge className={`${getCategoryBadgeColor(racer.category)} text-white`}>
                  {racer.category}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {racer.vehicleType}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary" className="font-mono font-bold text-lg">
                  {racer.points}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderHistorical = () => (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Body z jednotlivých událostí</h3>
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Historické údaje zatím nejsou k dispozici</p>
        <p className="text-sm">Budou zobrazeny po dokončení prvních závodů</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Tournament Card */}
        <Card
          className={`shadow-card cursor-pointer hover:shadow-lg transition-all duration-200 border-primary/20 hover:border-primary/40 ${selectedView === 'current-tournament' ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
          onClick={() => setSelectedView('current-tournament')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Medal className="w-8 h-8 text-primary" />
              <div>
                <p className="text-lg font-bold">Aktuální turnaj</p>
                <p className="text-sm text-muted-foreground">Body z probíhajícího turnaje</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Overview Card */}
        <Card
          className={`shadow-card cursor-pointer hover:shadow-lg transition-all duration-200 border-primary/20 hover:border-primary/40 ${selectedView === 'overall-overview' ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
          onClick={() => setSelectedView('overall-overview')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <p className="text-lg font-bold">Celkový přehled</p>
                <p className="text-sm text-muted-foreground">Body všech jezdců</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Top Card */}
        <Card
          className={`shadow-card cursor-pointer hover:shadow-lg transition-all duration-200 border-primary/20 hover:border-primary/40 ${selectedView === 'overall-top' ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
          onClick={() => setSelectedView('overall-top')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              <div>
                <p className="text-lg font-bold">Celkové pořadí</p>
                <p className="text-sm text-muted-foreground">TOP 10 jezdců ze všech kategorií</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historical Events Card */}
        <Card
          className={`shadow-card cursor-pointer hover:shadow-lg transition-all duration-200 border-primary/20 hover:border-primary/40 ${selectedView === 'historical' ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
          onClick={() => setSelectedView('historical')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-lg font-bold">Historické události</p>
                <p className="text-sm text-muted-foreground">Body z předchozích závodů</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables shown below based on selected view */}
      {selectedView === 'current-tournament' && renderCurrentTournament()}
      {selectedView === 'overall-overview' && renderOverallOverview()}
      {selectedView === 'overall-top' && renderOverallTop()}
      {selectedView === 'historical' && renderHistorical()}
    </div>
  );
});