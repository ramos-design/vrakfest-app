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
}

export const RacerTable = ({ racers, onEdit, onDelete, onAdd }: RacerTableProps) => {
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
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5" />
            Přehled přihlášených jezdců ({racers.length}/80)
          </h2>
          <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-md inline-block">
            Událost: VrakFest Branky na Moravě
          </div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <Input
          placeholder="Hledat jezdce..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            size="default"
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-2 ${categoryFilter === 'all' ? 'racing-btn-primary' : 'border-racing-yellow/20 hover:bg-racing-yellow/10'}`}
          >
            Vše
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={categoryFilter === category ? 'default' : 'outline'}
              size="default"
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 ${categoryFilter === category ? 'racing-btn-primary' : 'border-racing-yellow/20 hover:bg-racing-yellow/10'}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Číslo</TableHead>
              <TableHead className="text-muted-foreground">Jméno</TableHead>
              <TableHead className="text-muted-foreground">Vozidlo</TableHead>
              <TableHead className="text-muted-foreground">Kategorie</TableHead>
              <TableHead className="text-muted-foreground text-center">Body</TableHead>
              <TableHead className="text-muted-foreground">Akce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRacers.map((racer, index) => (
              <TableRow key={racer.id} className="border-border hover:bg-muted/30 transition-racing">
                <TableCell>
                  <Badge className="font-mono bg-yellow-400 text-black border-0 hover:bg-yellow-400">
                    {racer.startNumber}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {capitalizeText(racer.firstName)} {capitalizeText(racer.lastName)}
                </TableCell>
                <TableCell className="text-muted-foreground">{capitalizeText(racer.vehicleType)}</TableCell>
                <TableCell>
                  <Badge className={`${getCategoryBadgeColor(racer.category)} text-white border-0`}>
                    {racer.category}
                  </Badge>
                </TableCell>
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
                      <Pencil className="w-4 h-4" />
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
};