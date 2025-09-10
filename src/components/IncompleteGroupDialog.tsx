import { useState } from 'react';
import { AlertTriangle, UserPlus, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RaceGroup, Racer } from '@/types/racing';
import { getCategoryBadgeColor } from '@/utils/racingUtils';

interface IncompleteGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  group: RaceGroup;
  targetGroupSize: number;
  availableRacers: Racer[];
  onContinueWithCurrentSize: () => void;
  onAddRacersAndStart: (racerIds: string[]) => void;
  minimumRacers?: number;
}

export const IncompleteGroupDialog = ({
  isOpen,
  onClose,
  group,
  targetGroupSize,
  availableRacers,
  onContinueWithCurrentSize,
  onAddRacersAndStart,
  minimumRacers = 5
}: IncompleteGroupDialogProps) => {
  const [selectedRacerIds, setSelectedRacerIds] = useState<string[]>([]);
  
  const missingRacers = targetGroupSize - group.racers.length;
  const maxSelectableRacers = Math.min(missingRacers, availableRacers.length);
  const canContinueWithCurrentSize = group.racers.length >= minimumRacers;
  const racersNeededToMeetMinimum = Math.max(0, minimumRacers - group.racers.length);
  const willMeetMinimumWithSelection = group.racers.length + selectedRacerIds.length >= minimumRacers;

  const toggleRacer = (racerId: string) => {
    setSelectedRacerIds(prev => 
      prev.includes(racerId) 
        ? prev.filter(id => id !== racerId)
        : prev.length < maxSelectableRacers 
          ? [...prev, racerId]
          : prev
    );
  };

  const handleAddRacersAndStart = () => {
    onAddRacersAndStart(selectedRacerIds);
    setSelectedRacerIds([]);
    onClose();
  };

  const handleContinueWithCurrentSize = () => {
    onContinueWithCurrentSize();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            Nekompletní skupina
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className={`${!canContinueWithCurrentSize ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'} border rounded-lg p-4`}>
            <div className="flex items-center gap-3 mb-3">
              <h3 className={`font-semibold ${!canContinueWithCurrentSize ? 'text-red-800' : 'text-orange-800'}`}>
                Skupina {group.id.split('group')[1]}
              </h3>
              <Badge className={`${getCategoryBadgeColor(group.category)} text-white`}>
                {group.category}
              </Badge>
            </div>
            <p className={!canContinueWithCurrentSize ? 'text-red-700' : 'text-orange-700'}>
              Ve skupině je pouze <strong>{group.racers.length} jezdců</strong> z doporučených <strong>{targetGroupSize} jezdců</strong>.
              {!canContinueWithCurrentSize && (
                <><br /><strong>⚠️ Minimálně {minimumRacers} jezdců je vyžadováno pro spuštění závodu!</strong></>
              )}
              {racersNeededToMeetMinimum > 0 && (
                <><br />Chybí ještě <strong>{racersNeededToMeetMinimum} jezdců</strong> pro dosažení minima.</>
              )}
            </p>
          </div>

          {availableRacers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Dostupní jezdci ze stejné kategorie</h4>
                <Badge variant="outline">
                  {availableRacers.length} dostupných
                </Badge>
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-3">
                {availableRacers.map(racer => (
                  <div key={racer.id} className="flex items-center space-x-3 p-2 rounded border bg-muted/30">
                    <Checkbox
                      id={`racer-${racer.id}`}
                      checked={selectedRacerIds.includes(racer.id)}
                      onCheckedChange={() => toggleRacer(racer.id)}
                      disabled={!selectedRacerIds.includes(racer.id) && selectedRacerIds.length >= maxSelectableRacers}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          #{racer.startNumber}
                        </Badge>
                        <span className="font-medium">
                          {racer.firstName} {racer.lastName}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {racer.vehicleType}
                      </div>
                    </div>
                    <Badge className={`${getCategoryBadgeColor(racer.category)} text-white`}>
                      {racer.category}
                    </Badge>
                    <Badge variant="secondary" className="font-mono">
                      {racer.points}b
                    </Badge>
                  </div>
                ))}
              </div>

              {selectedRacerIds.length > 0 && (
                <div className={`${willMeetMinimumWithSelection ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-3`}>
                  <p className={willMeetMinimumWithSelection ? 'text-green-700' : 'text-blue-700'}>
                    Vybráno <strong>{selectedRacerIds.length}</strong> z <strong>{maxSelectableRacers}</strong> možných jezdců
                    {willMeetMinimumWithSelection && (
                      <><br />✅ <strong>Minimum {minimumRacers} jezdců bude splněno</strong></>
                    )}
                    {!willMeetMinimumWithSelection && racersNeededToMeetMinimum > 0 && (
                      <><br />⚠️ Stále chybí <strong>{racersNeededToMeetMinimum - selectedRacerIds.length} jezdců</strong> pro minimum</>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Zrušit
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleContinueWithCurrentSize}
              className="flex-1"
              disabled={!canContinueWithCurrentSize}
            >
              <Play className="w-4 h-4 mr-2" />
              {canContinueWithCurrentSize 
                ? `Pokračovat s ${group.racers.length} jezdci`
                : `Nelze - minimum ${minimumRacers} jezdců`
              }
            </Button>
            
            {availableRacers.length > 0 && (
              <Button 
                onClick={handleAddRacersAndStart}
                className="racing-gradient shadow-racing flex-1"
                disabled={selectedRacerIds.length === 0 || !willMeetMinimumWithSelection}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {willMeetMinimumWithSelection 
                  ? `Přidat ${selectedRacerIds.length} jezdců a spustit`
                  : `Vyberte alespoň ${racersNeededToMeetMinimum} jezdců`
                }
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};