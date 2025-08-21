import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, TrendingUp, Users, Medal, Calendar, ChevronRight } from 'lucide-react';
import { Racer, RacerCategory, Tournament } from '@/types/racing';
import { categories, getCategoryBadgeColor } from '@/utils/racingUtils';

interface StatisticsProps {
  racers: Racer[];
  tournament: Tournament;
}

export const Statistics = ({ racers, tournament }: StatisticsProps) => {
  const activeRacers = racers.filter(r => r.isActive);

  // Calculate tournament points (points gained only from current tournament)
  const getTournamentPoints = (racerId: string): number => {
    if (!tournament || !tournament.groups) return 0;
    
    return tournament.groups.reduce((totalPoints, group) => {
      if (!group.results || !group.isCompleted) return totalPoints;
      
      const result = group.results.find(r => r.racerId === racerId);
      return totalPoints + (result ? result.points : 0);
    }, 0);
  };

  const getTopRacersByCategory = (category: RacerCategory) => {
    return activeRacers
      .filter(r => r.category === category)
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
  };

  const getTournamentRacersByCategory = (category: RacerCategory) => {
    return activeRacers
      .filter(r => r.category === category)
      .map(racer => ({
        ...racer,
        tournamentPoints: getTournamentPoints(racer.id)
      }))
      .sort((a, b) => b.tournamentPoints - a.tournamentPoints);
  };

  const overallTop = activeRacers
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  const CurrentTournamentDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="shadow-card cursor-pointer hover:shadow-lg transition-all duration-200 border-primary/20 hover:border-primary/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Medal className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-lg font-bold">Aktuální turnaj</p>
                  <p className="text-sm text-muted-foreground">Body z probíhajícího turnaje</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pořadí v aktuálním turnaji</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
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
                                <Trophy className={`w-4 h-4 mr-1 ${
                                  index === 0 ? 'text-yellow-500' : 
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
      </DialogContent>
    </Dialog>
  );

  const OverallOverviewDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="shadow-card cursor-pointer hover:shadow-lg transition-all duration-200 border-primary/20 hover:border-primary/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-lg font-bold">Celkový přehled</p>
                  <p className="text-sm text-muted-foreground">Body všech jezdců</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Celkový přehled bodů všech jezdců</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map(category => {
            const categoryRacers = activeRacers
              .filter(r => r.category === category)
              .sort((a, b) => b.points - a.points);
            return (
              <TabsContent key={category} value={category}>
                {categoryRacers.length > 0 ? (
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
                      {categoryRacers.map((racer, index) => (
                        <TableRow key={racer.id} className="transition-racing hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center">
                              {index < 3 && (
                                <Trophy className={`w-4 h-4 mr-1 ${
                                  index === 0 ? 'text-yellow-500' : 
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
      </DialogContent>
    </Dialog>
  );

  const OverallTopDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="shadow-card cursor-pointer hover:shadow-lg transition-all duration-200 border-primary/20 hover:border-primary/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-lg font-bold">Celkové pořadí</p>
                  <p className="text-sm text-muted-foreground">TOP 10 jezdců ze všech kategorií</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Celkové pořadí - TOP 10</DialogTitle>
        </DialogHeader>
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
                      <Trophy className={`w-4 h-4 mr-1 ${
                        index === 0 ? 'text-yellow-500' : 
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
      </DialogContent>
    </Dialog>
  );

  const HistoricalEventsDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="shadow-card cursor-pointer hover:shadow-lg transition-all duration-200 border-primary/20 hover:border-primary/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-lg font-bold">Historické události</p>
                  <p className="text-sm text-muted-foreground">Body z předchozích závodů</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Body z jednotlivých událostí</DialogTitle>
        </DialogHeader>
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Historické údaje zatím nejsou k dispozici</p>
          <p className="text-sm">Budou zobrazeny po dokončení prvních závodů</p>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Clickable Cards in order requested by user */}
        <CurrentTournamentDialog />
        <OverallOverviewDialog />
        <OverallTopDialog />
        <HistoricalEventsDialog />
      </div>
    </div>
  );
};