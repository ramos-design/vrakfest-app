import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Racer, RacerCategory } from '@/types/racing';
import { RacerForm } from '@/components/RacerForm';
import { Edit, Trash2, Plus, X, Trophy, Users, UserPlus, Target } from 'lucide-react';

interface RacerOverviewProps {
  racers: Racer[];
  demolitionDerbyRacers: string[];
  onEdit: (racer: Racer) => void;
  onDelete: (id: string) => void;
  onDeactivate: (id: string) => void;
  onActivate: (id: string) => void;
  onAddToDemolitionDerby: (id: string) => void;
  onRemoveFromDemolitionDerby: (id: string) => void;
  onSave: (racerData: Omit<Racer, 'id'>) => void;
  onCancel: () => void;
  editingRacer: Racer | null;
}

export function RacerOverview({ 
  racers, 
  demolitionDerbyRacers,
  onEdit, 
  onDelete, 
  onDeactivate, 
  onActivate, 
  onAddToDemolitionDerby,
  onRemoveFromDemolitionDerby,
  onSave, 
  onCancel, 
  editingRacer 
}: RacerOverviewProps) {
  const categories: RacerCategory[] = ['do 1.6L', 'nad 1.6L', 'Ženy'];
  const [activeCategory, setActiveCategory] = useState<RacerCategory>('do 1.6L');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'tournament' | 'all' | 'demolition-derby'>('all');

  const getRacersByCategory = (category: RacerCategory) => {
    let filteredRacers;
    if (viewMode === 'tournament') {
      filteredRacers = racers.filter(racer => racer.category === category && racer.isActive);
    } else if (viewMode === 'demolition-derby') {
      filteredRacers = racers.filter(racer => 
        racer.category === category && demolitionDerbyRacers?.includes(racer.id)
      );
    } else {
      filteredRacers = racers.filter(racer => racer.category === category);
    }
    
    return filteredRacers.sort((a, b) => b.points - a.points);
  };

  const handleEdit = (racer: Racer) => {
    if (viewMode === 'demolition-derby') return; // No editing in demolition derby
    onEdit(racer);
    setIsPanelOpen(true);
  };

  const handleSave = (racerData: Omit<Racer, 'id'>) => {
    onSave(racerData);
    setIsPanelOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsPanelOpen(false);
  };

  const handleDelete = (racerId: string) => {
    if (viewMode === 'tournament') {
      onDeactivate(racerId);
    } else if (viewMode === 'demolition-derby') {
      onRemoveFromDemolitionDerby(racerId);
    } else {
      onDelete(racerId);
    }
  };

  const handleAddRacer = () => {
    if (viewMode === 'demolition-derby') return; // No adding in demolition derby
    setIsPanelOpen(true);
  };

  const handleHidePanel = () => {
    onCancel();
    setIsPanelOpen(false);
  };

  const renderRacerTable = (categoryRacers: Racer[]) => (
    <div className="bg-card rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-muted-foreground">Startovní číslo</TableHead>
            <TableHead className="text-muted-foreground">Jméno</TableHead>
            <TableHead className="text-muted-foreground">Vozidlo</TableHead>
            {viewMode !== 'demolition-derby' && (
              <TableHead className="text-muted-foreground text-center">Body</TableHead>
            )}
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
              {viewMode !== 'demolition-derby' && (
                <TableCell className="text-center">
                  <span className="font-bold text-foreground">{racer.points}</span>
                </TableCell>
              )}
               <TableCell>
                 <div className="flex gap-1">
                   {/* Edit button - not available in demolition derby */}
                   {viewMode !== 'demolition-derby' && (
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => handleEdit(racer)}
                       className="w-8 h-8 p-0 hover:bg-primary/10 hover:text-primary"
                     >
                       <Edit className="w-4 h-4" />
                     </Button>
                   )}
                   
                   {/* Add to tournament - only in "all" view for inactive racers */}
                   {viewMode === 'all' && !racer.isActive && (
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => onActivate(racer.id)}
                       className="w-8 h-8 p-0 hover:bg-green-600/10 hover:text-green-600"
                       title="Přidat do aktuálního turnaje"
                     >
                       <UserPlus className="w-4 h-4" />
                     </Button>
                   )}

                    {/* Add to demolition derby - only in "all" view for racers not in demolition derby */}
                    {viewMode === 'all' && !demolitionDerbyRacers?.includes(racer.id) && (
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => onAddToDemolitionDerby(racer.id)}
                       className="w-8 h-8 p-0 hover:bg-orange-600/10 hover:text-orange-600"
                       title="Přidat do demolition derby tabulky"
                     >
                       <Target className="w-4 h-4" />
                     </Button>
                   )}
                   
                   {/* Delete button - available in all views */}
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => handleDelete(racer.id)}
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
                <TableCell colSpan={viewMode === 'demolition-derby' ? 4 : 5} className="text-center text-muted-foreground py-8">
                  {viewMode === 'tournament' 
                    ? 'V této kategorii nejsou žádní aktivní jezdci'
                    : viewMode === 'demolition-derby'
                    ? 'V této kategorii nejsou žádní jezdci v demolition derby'
                    : 'V této kategorii nejsou žádní jezdci'}
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className={`grid gap-6 ${isPanelOpen ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
      <div className={isPanelOpen ? "lg:col-span-2" : "col-span-1"}>
        <Card className="racing-card border-racing-yellow/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="racing-gradient-text text-xl">
                Přehled jezdců podle kategorií
              </CardTitle>
              <Button 
                onClick={isPanelOpen ? handleHidePanel : handleAddRacer}
                className={isPanelOpen ? "bg-red-600 hover:bg-red-700 text-white" : "bg-primary hover:bg-primary/90"}
              >
                {isPanelOpen ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Skrýt panel
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Přidat jezdce
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <span className="text-sm text-muted-foreground">Zobrazit:</span>
              <ToggleGroup 
                type="single" 
                value={viewMode} 
                onValueChange={(value) => value && setViewMode(value as 'tournament' | 'all' | 'demolition-derby')}
                className="bg-card border border-border rounded-lg p-1"
              >
                <ToggleGroupItem 
                  value="all" 
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-sm px-3 py-2"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Všichni jezdci
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="tournament" 
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-sm px-3 py-2"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Aktuální turnaj
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="demolition-derby" 
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-sm px-3 py-2"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Demolition derby
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
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
                        <span className="text-sm text-muted-foreground ml-2">
                          ({viewMode === 'tournament' 
                            ? 'Aktuální turnaj' 
                            : viewMode === 'demolition-derby'
                            ? 'Demolition derby'
                            : 'Všichni jezdci'})
                        </span>
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
        {isPanelOpen && (
          <RacerForm
            racer={editingRacer}
            onSave={handleSave}
            onCancel={handleCancel}
            compact={true}
          />
        )}
      </div>
    </div>
  );
}