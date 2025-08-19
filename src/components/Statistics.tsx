import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Users } from 'lucide-react';
import { Racer, RacerCategory, Tournament } from '@/types/racing';
import { categories, getCategoryBadgeColor } from '@/utils/racingUtils';

interface StatisticsProps {
  racers: Racer[];
  tournament: Tournament;
}

export const Statistics = ({ racers, tournament }: StatisticsProps) => {
  const activeRacers = racers.filter(r => r.isActive);
  const totalPoints = activeRacers.reduce((sum, racer) => sum + racer.points, 0);
  const averagePoints = activeRacers.length > 0 ? (totalPoints / activeRacers.length).toFixed(1) : '0';

  const getTopRacersByCategory = (category: RacerCategory) => {
    return activeRacers
      .filter(r => r.category === category)
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
  };

  const overallTop = activeRacers
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Tournament Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{activeRacers.length}</p>
                <p className="text-sm text-muted-foreground">Aktivních jezdců</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{averagePoints}</p>
                <p className="text-sm text-muted-foreground">Průměr bodů</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  {tournament.isActive ? `Kolo ${tournament.currentRound}` : 'Čeká'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tournament.isActive ? tournament.currentCategory : 'Na zahájení'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Leaderboard */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="racing-gradient bg-clip-text text-transparent">
            Celkové pořadí - Top 10
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Category Leaderboards */}
      {categories.map(category => {
        const categoryRacers = getTopRacersByCategory(category);
        
        if (categoryRacers.length === 0) return null;
        
        return (
          <Card key={category} className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CardTitle className="racing-gradient bg-clip-text text-transparent">
                  Žebříček kategorie
                </CardTitle>
                <Badge className={`${getCategoryBadgeColor(category)} text-white text-lg px-3 py-1`}>
                  {category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Jezdec</TableHead>
                    <TableHead>Vozidlo</TableHead>
                    <TableHead className="text-right">Body</TableHead>
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};