import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, UserPlus } from 'lucide-react';
import { Racer } from '@/types/racing';

interface AddRacersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  availableRacers: Racer[];
  onAddRacer: (racerId: string) => void;
}

export const AddRacersDialog = ({ 
  isOpen, 
  onClose, 
  availableRacers, 
  onAddRacer 
}: AddRacersDialogProps) => {
  const [selectedRacers, setSelectedRacers] = useState<Set<string>>(new Set());

  const handleAddRacer = (racerId: string) => {
    onAddRacer(racerId);
    setSelectedRacers(prev => new Set([...prev, racerId]));
  };

  const handleClose = () => {
    setSelectedRacers(new Set());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="racing-gradient bg-clip-text text-transparent text-xl flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Přidat jezdce do turnaje
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {availableRacers.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Všichni jezdci jsou již přidáni do turnaje</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[50vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Číslo</TableHead>
                    <TableHead>Jméno</TableHead>
                    <TableHead>Kategorie</TableHead>
                    <TableHead>Vozidlo</TableHead>
                    <TableHead className="w-32">Akce</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableRacers.map(racer => (
                    <TableRow key={racer.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          #{racer.startNumber}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {racer.firstName} {racer.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary text-primary-foreground">
                          {racer.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {racer.vehicleType}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleAddRacer(racer.id)}
                          size="sm"
                          className="racing-gradient shadow-racing"
                          disabled={selectedRacers.has(racer.id)}
                        >
                          {selectedRacers.has(racer.id) ? (
                            <>Přidán</>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1" />
                              Přidat
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Zavřít
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};