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
            Událost: VrakFest Ostrava
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <Input
          placeholder="HLEDAT JEZDCE..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-black/50 border-white/10 text-white font-tech uppercase focus:border-racing-yellow rounded-none"
        />
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-2 whitespace-nowrap rounded-none font-bebas tracking-wide text-lg ${categoryFilter === 'all' ? 'bg-racing-yellow text-black hover:bg-white' : 'border-white/20 text-white hover:bg-white/10'}`}
          >
            <span>VŠE</span>
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={categoryFilter === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 whitespace-nowrap rounded-none font-bebas tracking-wide text-lg ${categoryFilter === category ? 'bg-racing-yellow text-black hover:bg-white' : 'border-white/20 text-white hover:bg-white/10'}`}
            >
              <span>{category.toUpperCase()}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#111]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-white/40 font-tech text-xs uppercase tracking-widest min-w-[60px]">Číslo</TableHead>
                <TableHead className="text-white/40 font-tech text-xs uppercase tracking-widest min-w-[150px]">Jméno</TableHead>
                <TableHead className="text-white/40 font-tech text-xs uppercase tracking-widest min-w-[120px] hidden sm:table-cell">Vozidlo</TableHead>
                <TableHead className="text-white/40 font-tech text-xs uppercase tracking-widest min-w-[100px]">Kategorie</TableHead>
                <TableHead className="text-white/40 font-tech text-xs uppercase tracking-widest text-center min-w-[60px]">Body</TableHead>
                {showActions && <TableHead className="text-white/40 font-tech text-xs uppercase tracking-widest min-w-[80px]">Akce</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRacers.map((racer, index) => (
                <TableRow key={racer.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell>
                    <div className="font-bebas text-xl bg-racing-yellow text-black inline-block px-2">
                      <span className="block">{racer.startNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-white font-bebas text-lg tracking-wide">{capitalizeText(racer.firstName)} {capitalizeText(racer.lastName)}</span>
                      <span className="text-xs text-white/40 font-tech uppercase sm:hidden">{capitalizeText(racer.vehicleType)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white/60 hidden sm:table-cell text-sm font-tech uppercase">{capitalizeText(racer.vehicleType)}</TableCell>
                  <TableCell>
                    <Badge className={`${getCategoryBadgeColor(racer.category)} text-white border-0 text-[10px] font-tech uppercase rounded-none`}>
                      <span>{racer.category}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-bebas text-2xl text-racing-yellow">{racer.points}</span>
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(racer)}
                          className="h-8 w-8 p-0 hover:bg-racing-yellow hover:text-black rounded-none"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(racer.id)}
                          className="h-8 w-8 p-0 hover:bg-red-600 hover:text-white rounded-none"
                        >
                          <Trash2 className="w-4 h-4" />
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