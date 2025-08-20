import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Racer, RacerCategory } from '@/types/racing';

interface RacerOverviewProps {
  racers: Racer[];
}

export function RacerOverview({ racers }: RacerOverviewProps) {
  const categories: RacerCategory[] = ['do 1.6L', 'nad 1.6L', 'Ženy'];
  const [activeCategory, setActiveCategory] = useState<RacerCategory>('do 1.6L');

  const getRacersByCategory = (category: RacerCategory) => {
    return racers
      .filter(racer => racer.category === category && racer.isActive)
      .sort((a, b) => b.points - a.points);
  };

  const renderRacerTable = (categoryRacers: Racer[]) => (
    <div className="racing-card border border-racing-yellow/30">
      <Table>
        <TableHeader>
          <TableRow className="border-racing-yellow/20">
            <TableHead className="text-racing-white font-medium">Startovní číslo</TableHead>
            <TableHead className="text-racing-white font-medium">Jméno</TableHead>
            <TableHead className="text-racing-white font-medium">Vozidlo</TableHead>
            <TableHead className="text-racing-white font-medium">Body celkem</TableHead>
            <TableHead className="text-racing-white font-medium">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoryRacers.map((racer, index) => (
            <TableRow key={racer.id} className="border-racing-yellow/10 hover:bg-racing-yellow/5">
              <TableCell className="font-medium text-racing-yellow">
                #{racer.startNumber}
              </TableCell>
              <TableCell className="text-racing-white">{racer.firstName} {racer.lastName}</TableCell>
              <TableCell className="text-racing-white">{racer.vehicleType}</TableCell>
              <TableCell className="text-racing-white font-semibold">
                <span className="racing-gradient-text">{racer.points}</span>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={racer.isActive ? "default" : "secondary"}
                  className={racer.isActive ? "racing-gradient text-racing-black" : "bg-gray-600"}
                >
                  {racer.isActive ? "Aktivní" : "Neaktivní"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {categoryRacers.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                V této kategorii nejsou žádní aktivní jezdci
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="racing-card border-racing-yellow/30">
        <CardHeader>
          <CardTitle className="racing-gradient-text text-xl">
            Přehled jezdců podle kategorií
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as RacerCategory)}>
            <TabsList className="grid w-full grid-cols-3 bg-racing-black/50 border border-racing-yellow/20">
              {categories.map((category) => {
                const categoryRacers = getRacersByCategory(category);
                return (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="data-[state=active]:racing-gradient data-[state=active]:text-racing-black text-racing-white"
                  >
                    {category} ({categoryRacers.length})
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-racing-white">
                      Kategorie: <span className="racing-gradient-text">{category}</span>
                    </h3>
                    <Badge variant="outline" className="border-racing-yellow text-racing-yellow">
                      {getRacersByCategory(category).length} jezdců
                    </Badge>
                  </div>
                  {renderRacerTable(getRacersByCategory(category))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}