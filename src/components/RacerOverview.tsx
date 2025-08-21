import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Racer, RacerCategory } from '@/types/racing';
import { RacerForm } from '@/components/RacerForm';
import { Edit, Trash2 } from 'lucide-react';

interface RacerOverviewProps {
  racers: Racer[];
  onEdit: (racer: Racer) => void;
  onDelete: (id: string) => void;
  onSave: (racerData: Omit<Racer, 'id'>) => void;
  onCancel: () => void;
  editingRacer: Racer | null;
}

export function RacerOverview({ racers, onEdit, onDelete, onSave, onCancel, editingRacer }: RacerOverviewProps) {
  const categories: RacerCategory[] = ['do 1.6L', 'nad 1.6L', 'Ženy'];
  const [activeCategory, setActiveCategory] = useState<RacerCategory>('do 1.6L');

  const getRacersByCategory = (category: RacerCategory) => {
    return racers
      .filter(racer => racer.category === category && racer.isActive)
      .sort((a, b) => b.points - a.points);
  };

  const renderRacerTable = (categoryRacers: Racer[]) => (
    <div className="bg-card rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-muted-foreground">Startovní číslo</TableHead>
            <TableHead className="text-muted-foreground">Jméno</TableHead>
            <TableHead className="text-muted-foreground">Vozidlo</TableHead>
            <TableHead className="text-muted-foreground text-center">Body</TableHead>
            <TableHead className="text-muted-foreground">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoryRacers.map((racer, index) => (
            <TableRow key={racer.id} className="border-border hover:bg-muted/30 transition-colors">
              <TableCell>
                <Badge className="font-mono bg-yellow-400 text-black border-0 hover:bg-yellow-400">
                  {racer.startNumber}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                {racer.firstName} {racer.lastName}
              </TableCell>
              <TableCell className="text-muted-foreground">{racer.vehicleType}</TableCell>
              <TableCell className="text-center">
                <span className="font-bold text-foreground">{racer.points}</span>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(racer)}
                    className="w-8 h-8 p-0 hover:bg-primary/10 hover:text-primary"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(racer.id)}
                    className="w-8 h-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
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
      
      <div className="space-y-6">
        <RacerForm
          racer={editingRacer}
          onSave={onSave}
          onCancel={onCancel}
          compact={true}
        />
      </div>
    </div>
  );
}