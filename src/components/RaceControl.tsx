import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, XCircle, Timer, AlertTriangle, Play, Flag } from 'lucide-react';
import { RaceGroup, Racer, RaceResult } from '@/types/racing';
import { getCategoryBadgeColor } from '@/utils/racingUtils';

interface RaceControlProps {
  currentGroup: RaceGroup | null;
  onCompleteRace: (groupId: string, results: RaceResult[]) => void;
}

export const RaceControl = ({ currentGroup, onCompleteRace }: RaceControlProps) => {
  const [points, setPoints] = useState<{ [racerId: string]: number }>({});
  const [advances, setAdvances] = useState<{ [racerId: string]: boolean }>({});
  const [raceStartTime, setRaceStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [finishOrder, setFinishOrder] = useState<{ [racerId: string]: { position: number; time: number } }>({});
  const [isCrashActive, setIsCrashActive] = useState<boolean>(false);
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentGroup?.hasStarted && raceStartTime && !isPaused && !isCrashActive) {
      interval = setInterval(() => {
        setCurrentTime(Date.now() - raceStartTime);
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [raceStartTime, isPaused, isCrashActive, currentGroup?.hasStarted]);

  // Auto-start timer when race starts
  useEffect(() => {
    if (currentGroup?.hasStarted && !raceStartTime) {
      setRaceStartTime(Date.now());
      setCurrentTime(0);
    }
  }, [currentGroup?.hasStarted, raceStartTime]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRacerFinish = (racerId: string) => {
    if (finishOrder[racerId]) return; // Already finished
    
    const finishTime = currentTime;
    const position = Object.keys(finishOrder).length + 1;
    
    setFinishOrder(prev => ({
      ...prev,
      [racerId]: { position, time: finishTime }
    }));
  };

  const handleCrashToggle = () => {
    setIsCrashActive(!isCrashActive);
  };

  const handleCompleteRace = () => {
    if (!currentGroup) return;
    
    const results: RaceResult[] = currentGroup.racers.map(racer => ({
      racerId: racer.id,
      points: points[racer.id] || 0,
      advances: advances[racer.id] !== undefined ? advances[racer.id] : true // Default to true (postupuje)
    }));

    onCompleteRace(currentGroup.id, results);
    setPoints({});
    setAdvances({});
    setRaceStartTime(null);
    setCurrentTime(0);
    setFinishOrder({});
    setIsCrashActive(false);
    
    // Automatically redirect to tournament tab after completing race
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('redirectToTournament'));
    }, 100);
  };

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

  const handleAdvancesChange = (racerId: string, willAdvance: boolean) => {
    setAdvances({ ...advances, [racerId]: willAdvance });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
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
        
        {/* Race Timer and Controls */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              <span className="text-2xl font-mono font-bold">
                {formatTime(currentTime)}
              </span>
            </div>
            
            {(isPaused || isCrashActive) && (
              <Badge variant="destructive">
                {isCrashActive ? 'BOUDA' : 'POZASTAVENO'}
              </Badge>
            )}
          </div>
          
          <Button
            onClick={handleCrashToggle}
            variant={isCrashActive ? "default" : "destructive"}
            className={isCrashActive ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isCrashActive ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Pokračovat v závodu
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Bouda
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            {currentGroup.racers.map((racer, index) => {
              const racerFinish = finishOrder[racer.id];
              const isFinished = !!racerFinish;
              
              return (
                <div 
                  key={racer.id} 
                  className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors ${
                    isFinished 
                      ? 'bg-green-100 border-2 border-green-300' 
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                  onClick={() => !isFinished && handleRacerFinish(racer.id)}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      #{index + 1}
                    </Badge>
                    {isFinished && (
                      <Badge className="bg-green-600 text-white font-mono">
                        <Flag className="w-3 h-3 mr-1" />
                        {racerFinish.position}.
                      </Badge>
                    )}
                  </div>
                  
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
                      {isFinished && (
                        <>
                          <span>•</span>
                          <Badge className="bg-blue-600 text-white font-mono">
                            Čas: {formatTime(racerFinish.time)}
                          </Badge>
                        </>
                      )}
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
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`advances-${racer.id}`}
                        checked={advances[racer.id] !== undefined ? advances[racer.id] : true}
                        onCheckedChange={(checked) => handleAdvancesChange(racer.id, checked as boolean)}
                      />
                      <Label htmlFor={`advances-${racer.id}`} className="text-sm">
                        Postupuje
                      </Label>
                    </div>
                    
                    {(advances[racer.id] !== undefined ? advances[racer.id] : true) ? (
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Postupuje
                      </Badge>
                    ) : (
                      <Badge className="bg-red-600 text-white">
                        <XCircle className="w-3 h-3 mr-1" />
                        Vypadává
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="pt-4 border-t">
            <Button
              onClick={handleCompleteRace}
              className="w-full racing-gradient shadow-racing"
              size="lg"
            >
              Ukončit jízdu a přidělit body
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};