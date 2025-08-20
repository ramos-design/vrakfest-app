import { useState } from 'react';
import { Settings, Users, Trophy, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TournamentSettings as ITournamentSettings, defaultTournamentSettings } from '@/types/tournamentSettings';
import { RacerCategory } from '@/types/racing';
import { getCategoryBadgeColor } from '@/utils/racingUtils';

interface TournamentSettingsProps {
  settings: ITournamentSettings;
  onSettingsChange: (settings: ITournamentSettings) => void;
  disabled?: boolean;
}

export const TournamentSettings = ({ settings, onSettingsChange, disabled = false }: TournamentSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<ITournamentSettings>(settings);

  const categories: RacerCategory[] = ['do 1.6L', 'nad 1.6L', 'Ženy'];

  const handleSave = () => {
    onSettingsChange(localSettings);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setIsOpen(false);
  };

  const toggleCategory = (category: RacerCategory) => {
    setLocalSettings(prev => ({
      ...prev,
      enabledCategories: prev.enabledCategories.includes(category)
        ? prev.enabledCategories.filter(c => c !== category)
        : [...prev.enabledCategories, category]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white text-foreground border-border hover:bg-gray-50"
          disabled={disabled}
        >
          <Settings className="w-4 h-4 mr-2" />
          Nastavení turnaje
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="racing-gradient bg-clip-text text-transparent text-xl">
            Nastavení turnaje
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Počet jezdců ve skupině */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-primary" />
                Velikost skupiny
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="racersPerGroup">Počet jezdců v jedné skupině</Label>
                <Input
                  id="racersPerGroup"
                  type="number"
                  min="3"
                  max="10"
                  value={localSettings.racersPerGroup}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    racersPerGroup: Math.max(3, Math.min(10, parseInt(e.target.value) || 6))
                  }))}
                />
                <p className="text-sm text-muted-foreground">
                  Doporučeno: 4-8 jezdců na skupinu
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bodový systém */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="w-5 h-5 text-primary" />
                Bodový systém
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPoints">Minimální body</Label>
                  <Input
                    id="minPoints"
                    type="number"
                    min="0"
                    max={localSettings.pointSystem.maxPoints - 1}
                    value={localSettings.pointSystem.minPoints}
                    onChange={(e) => setLocalSettings(prev => ({
                      ...prev,
                      pointSystem: {
                        ...prev.pointSystem,
                        minPoints: Math.max(0, parseInt(e.target.value) || 0)
                      }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPoints">Maximální body</Label>
                  <Input
                    id="maxPoints"
                    type="number"
                    min={localSettings.pointSystem.minPoints + 1}
                    max="50"
                    value={localSettings.pointSystem.maxPoints}
                    onChange={(e) => setLocalSettings(prev => ({
                      ...prev,
                      pointSystem: {
                        ...prev.pointSystem,
                        maxPoints: Math.max(prev.pointSystem.minPoints + 1, parseInt(e.target.value) || 10)
                      }
                    }))}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Body budou přidělovány v rozmezí {localSettings.pointSystem.minPoints}-{localSettings.pointSystem.maxPoints} bodů
              </p>
            </CardContent>
          </Card>

          {/* Kategorie */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-primary" />
                Kategorie v turnaji
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Vyberte kategorie, které budou součástí turnaje:
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-3 p-3 rounded-lg border">
                      <Checkbox
                        id={`category-${category}`}
                        checked={localSettings.enabledCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label 
                        htmlFor={`category-${category}`} 
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <Badge className={`${getCategoryBadgeColor(category)} text-white`}>
                          {category}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
                {localSettings.enabledCategories.length === 0 && (
                  <p className="text-sm text-destructive">
                    Musíte vybrat alespoň jednu kategorii!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tlačítka */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Zrušit
            </Button>
            <Button 
              onClick={handleSave}
              className="racing-gradient shadow-racing"
              disabled={localSettings.enabledCategories.length === 0}
            >
              Uložit nastavení
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};