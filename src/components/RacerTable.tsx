import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Users } from 'lucide-react';
import { Racer, RacerCategory } from '@/types/racing';
import { categories, getCategoryBadgeColor } from '@/utils/racingUtils';
import { capitalizeText } from '@/lib/utils';

interface RacerTableProps {
  racers: Racer[];
  onEdit: (racer: Racer) => void;
  onDelete: (id: string) => void;
  onAdd?: () => void;
  showActions?: boolean;
}

export const RacerTable = ({ racers, onEdit, onDelete, onAdd, showActions = true }: RacerTableProps) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredRacers = racers.filter(racer => {
    const matchesSearch = 
      racer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      racer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      racer.startNumber.toString().includes(search) ||
      racer.vehicleType.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || racer.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const sortedRacers = filteredRacers.sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Přehled přihlášených jezdců</span>
            <span className="sm:hidden">Jezdci</span>
            (<span className="text-yellow-400">{racers.length}</span>/80)
          </h2>
          <div className="text-xs md:text-sm text-muted-foreground bg-muted/50 px-2 md:px-3 py-1 rounded-md hidden lg:block">
            Událost: VrakFest Branky na Moravě
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <Input
          placeholder="Hledat jezdce..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-2 whitespace-nowrap ${categoryFilter === 'all' ? 'racing-btn-primary' : 'border-racing-yellow/20 hover:bg-racing-yellow/10'}`}
          >
            Vše
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={categoryFilter === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(category)}
              className={`px-3 py-2 whitespace-nowrap ${categoryFilter === category ? 'racing-btn-primary' : 'border-racing-yellow/20 hover:bg-racing-yellow/10'}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground min-w-[60px]">Číslo</TableHead>
                <TableHead className="text-muted-foreground min-w-[150px]">Jméno</TableHead>
                <TableHead className="text-muted-foreground min-w-[120px] hidden sm:table-cell">Vozidlo</TableHead>
                <TableHead className="text-muted-foreground min-w-[100px]">Kategorie</TableHead>
                <TableHead className="text-muted-foreground text-center min-w-[60px]">Body</TableHead>
                {showActions && <TableHead className="text-muted-foreground min-w-[80px]">Akce</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRacers.map((racer, index) => (
                <TableRow key={racer.id} className="border-border hover:bg-muted/30 transition-racing">
                  <TableCell>
                    <Badge className="font-mono bg-yellow-400 text-black border-0 hover:bg-yellow-400 text-xs">
                      {racer.startNumber}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-sm">{capitalizeText(racer.firstName)} {capitalizeText(racer.lastName)}</span>
                      <span className="text-xs text-muted-foreground sm:hidden">{capitalizeText(racer.vehicleType)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell text-sm">{capitalizeText(racer.vehicleType)}</TableCell>
                  <TableCell>
                    <Badge className={`${getCategoryBadgeColor(racer.category)} text-white border-0 text-xs`}>
                      {racer.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold text-foreground text-sm">{racer.points}</span>
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(racer)}
                          className="w-7 h-7 p-0 hover:bg-primary/10 hover:text-primary"
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(racer.id)}
                          className="w-7 h-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};