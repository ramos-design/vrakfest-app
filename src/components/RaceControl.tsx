import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { RaceGroup, Racer, RaceResult } from '@/types/racing';
import { getCategoryBadgeColor } from '@/utils/racingUtils';

interface RaceControlProps {
  currentGroup: RaceGroup | null;
  onCompleteRace: (groupId: string, results: RaceResult[]) => void;
}

export const RaceControl = ({ currentGroup, onCompleteRace }: RaceControlProps) => {
  const [points, setPoints] = useState<{ [racerId: string]: number }>({});

  if (!currentGroup) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="racing-gradient bg-clip-text text-transparent">
            Kontrola závodu
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Žádný aktivní závod</p>
        </CardContent>
      </Card>
    );
  }

  const handlePointsChange = (racerId: string, value: string) => {
    const pointValue = Math.max(0, Math.min(3, parseInt(value) || 0));
    setPoints({ ...points, [racerId]: pointValue });
  };

  const handleCompleteRace = () => {
    const results: RaceResult[] = currentGroup.racers.map(racer => ({
      racerId: racer.id,
      points: points[racer.id] || 0,
      advances: currentGroup.round <= 3 || (points[racer.id] || 0) >= 2
    }));

    onCompleteRace(currentGroup.id, results);
    setPoints({});
  };

  const allPointsAssigned = currentGroup.racers.every(racer => 
    points[racer.id] !== undefined && points[racer.id] >= 0
  );

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="racing-gradient bg-clip-text text-transparent">
            Kontrola závodu - Skupina {currentGroup.id.split('group')[1]}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={`${getCategoryBadgeColor(currentGroup.category)} text-white`}>
              {currentGroup.category}
            </Badge>
            <Badge variant="outline">Kolo {currentGroup.round}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            {currentGroup.racers.map((racer, index) => (
              <div key={racer.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <Badge variant="outline" className="font-mono">
                  #{index + 1}
                </Badge>
                
                <div className="flex-1">
                  <p className="font-medium">
                    {racer.firstName} {racer.lastName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>#{racer.startNumber}</span>
                    <span>•</span>
                    <span>{racer.vehicleType}</span>
                    <span>•</span>
                    <Badge variant="secondary" className="font-mono">
                      {racer.points}b celkem
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor={`points-${racer.id}`} className="text-sm">
                    Body (0-3):
                  </Label>
                  <Input
                    id={`points-${racer.id}`}
                    type="number"
                    min="0"
                    max="3"
                    value={points[racer.id] || ''}
                    onChange={(e) => handlePointsChange(racer.id, e.target.value)}
                    className="w-20 text-center font-mono"
                  />
                  
                  {currentGroup.round <= 3 ? (
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Postupuje
                    </Badge>
                  ) : (
                    (points[racer.id] || 0) >= 2 ? (
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Postupuje
                      </Badge>
                    ) : (
                      <Badge className="bg-red-600 text-white">
                        <XCircle className="w-3 h-3 mr-1" />
                        Vypadává
                      </Badge>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t">
            <Button
              onClick={handleCompleteRace}
              disabled={!allPointsAssigned}
              className="w-full racing-gradient shadow-racing"
              size="lg"
            >
              Ukončit jízdu a přidělit body
            </Button>
            
            {currentGroup.round <= 3 && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                První 3 kola: Všichni jezdci postupují bez ohledu na body
              </p>
            )}
            
            {currentGroup.round > 3 && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Od 4. kola: Postupují pouze jezdci s 2+ body
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};