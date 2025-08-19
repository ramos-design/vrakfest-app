import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { Racer, RacerCategory } from '@/types/racing';
import { categories, getCategoryBadgeColor } from '@/utils/racingUtils';

interface RacerTableProps {
  racers: Racer[];
  onEdit: (racer: Racer) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
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
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="racing-gradient bg-clip-text text-transparent">
            Jezdci ({racers.length}/100)
          </CardTitle>
          <Button onClick={onAdd} className="racing-gradient shadow-racing">
            <UserPlus className="w-4 h-4 mr-2" />
            Přidat jezdce
          </Button>
        </div>
        
        <div className="flex gap-4 mt-4">
          <Input
            placeholder="Hledat jezdce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Všechny kategorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všechny kategorie</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Jméno</TableHead>
                <TableHead>Startovní číslo</TableHead>
                <TableHead>Vozidlo</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Body</TableHead>
                <TableHead>Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRacers.map((racer, index) => (
                <TableRow key={racer.id} className="transition-racing hover:bg-muted/50">
                  <TableCell className="font-mono">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {racer.firstName} {racer.lastName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {racer.startNumber}
                    </Badge>
                  </TableCell>
                  <TableCell>{racer.vehicleType}</TableCell>
                  <TableCell>
                    <Badge className={`${getCategoryBadgeColor(racer.category)} text-white`}>
                      {racer.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono font-bold">
                      {racer.points}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(racer)}
                        className="transition-racing hover:shadow-racing"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(racer.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground transition-racing"
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
      </CardContent>
    </Card>
  );
};