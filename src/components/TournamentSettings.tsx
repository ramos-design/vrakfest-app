import { useState } from 'react';
import { Settings, Users, Trophy, Target, MapPin, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TournamentSettings as ITournamentSettings, defaultTournamentSettings, TrackOption } from '@/types/tournamentSettings';
import { RacerCategory, Racer } from '@/types/racing';
import { getCategoryBadgeColor } from '@/utils/racingUtils';
import { TrackSelection } from '@/components/TrackSelection';
import { AddRacersDialog } from '@/components/AddRacersDialog';

interface TournamentSettingsProps {
  settings: ITournamentSettings;
  onSettingsChange: (settings: ITournamentSettings) => void;
  disabled?: boolean;
  availableRacers?: Racer[];
  onAddRacer?: (racerId: string) => void;
  inline?: boolean;
}

export const TournamentSettings = ({ 
  settings, 
  onSettingsChange, 
  disabled = false, 
  availableRacers = [], 
  onAddRacer,
  inline = false 
}: TournamentSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<ITournamentSettings>(settings);
  const [showAddRacers, setShowAddRacers] = useState(false);

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

  const handleTrackSelect = (track: TrackOption) => {
    setLocalSettings(prev => ({
      ...prev,
      selectedTrack: track
    }));
  };

  const handleAddRacer = (racerId: string) => {
    if (onAddRacer) {
      onAddRacer(racerId);
    }
  };

  // Inline settings content
  const settingsContent = (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="racing-gradient bg-clip-text text-transparent text-xl font-semibold">
          Nastavení turnaje
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Levá strana */}
        <div className="space-y-6">
          {/* Výběr tratě */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-primary" />
                Výběr tratě
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TrackSelection 
                selectedTrack={localSettings.selectedTrack}
                onTrackSelect={handleTrackSelect}
              />
            </CardContent>
          </Card>

          {/* Přidání jezdců */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="w-5 h-5 text-primary" />
                Správa jezdců
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Přidejte jezdce do turnaje z celkového seznamu registrovaných jezdců.
                </p>
                <Button 
                  onClick={() => setShowAddRacers(true)}
                  variant="outline"
                  className="w-full"
                  disabled={availableRacers.length === 0}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Přidat jezdce do turnaje ({availableRacers.length} dostupných)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pravá strana */}
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
                  onChange={(e) => {
                    const newValue = Math.max(3, Math.min(10, parseInt(e.target.value) || 6));
                    const newSettings = {
                      ...localSettings,
                      racersPerGroup: newValue
                    };
                    setLocalSettings(newSettings);
                    onSettingsChange(newSettings);
                  }}
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
                    max={localSettings.pointSystem.maxPoints}
                    value={localSettings.pointSystem.minPoints}
                    onChange={(e) => {
                      const newValue = Math.max(0, Math.min(localSettings.pointSystem.maxPoints, parseInt(e.target.value) || 0));
                      const newSettings = {
                        ...localSettings,
                        pointSystem: {
                          ...localSettings.pointSystem,
                          minPoints: newValue
                        }
                      };
                      setLocalSettings(newSettings);
                      onSettingsChange(newSettings);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPoints">Maximální body</Label>
                  <Input
                    id="maxPoints"
                    type="number"
                    min={localSettings.pointSystem.minPoints}
                    max="50"
                    value={localSettings.pointSystem.maxPoints}
                    onChange={(e) => {
                      const newValue = Math.max(localSettings.pointSystem.minPoints, parseInt(e.target.value) || 3);
                      const newSettings = {
                        ...localSettings,
                        pointSystem: {
                          ...localSettings.pointSystem,
                          maxPoints: newValue
                        }
                      };
                      setLocalSettings(newSettings);
                      onSettingsChange(newSettings);
                    }}
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
                        onCheckedChange={() => {
                          const newCategories = localSettings.enabledCategories.includes(category)
                            ? localSettings.enabledCategories.filter(c => c !== category)
                            : [...localSettings.enabledCategories, category];
                          const newSettings = {
                            ...localSettings,
                            enabledCategories: newCategories
                          };
                          setLocalSettings(newSettings);
                          onSettingsChange(newSettings);
                        }}
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
        </div>
      </div>

      <AddRacersDialog
        isOpen={showAddRacers}
        onClose={() => setShowAddRacers(false)}
        availableRacers={availableRacers}
        onAddRacer={handleAddRacer}
      />
    </div>
  );

  if (inline) {
    return settingsContent;
  }

  // Original dialog version for other uses
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="lg"
          className="bg-white text-black border-border hover:bg-blue-600 hover:text-white transition-colors"
          disabled={disabled}
        >
          <Settings className="w-4 h-4 mr-2" />
          Nastavení turnaje
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="racing-gradient bg-clip-text text-transparent text-xl">
            Nastavení turnaje
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          {/* Levá strana */}
          <div className="space-y-6">
            {/* Výběr tratě */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  Výběr tratě
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrackSelection 
                  selectedTrack={localSettings.selectedTrack}
                  onTrackSelect={handleTrackSelect}
                />
              </CardContent>
            </Card>

            {/* Přidání jezdců */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserPlus className="w-5 h-5 text-primary" />
                  Správa jezdců
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Přidejte jezdce do turnaje z celkového seznamu registrovaných jezdců.
                  </p>
                  <Button 
                    onClick={() => setShowAddRacers(true)}
                    variant="outline"
                    className="w-full"
                    disabled={availableRacers.length === 0}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Přidat jezdce do turnaje ({availableRacers.length} dostupných)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pravá strana */}
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
                      max={localSettings.pointSystem.maxPoints}
                      value={localSettings.pointSystem.minPoints}
                      onChange={(e) => setLocalSettings(prev => ({
                        ...prev,
                        pointSystem: {
                          ...prev.pointSystem,
                          minPoints: Math.max(0, Math.min(prev.pointSystem.maxPoints, parseInt(e.target.value) || 0))
                        }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPoints">Maximální body</Label>
                    <Input
                      id="maxPoints"
                      type="number"
                      min={localSettings.pointSystem.minPoints}
                      max="50"
                      value={localSettings.pointSystem.maxPoints}
                      onChange={(e) => setLocalSettings(prev => ({
                        ...prev,
                        pointSystem: {
                          ...prev.pointSystem,
                          maxPoints: Math.max(prev.pointSystem.minPoints, parseInt(e.target.value) || 3)
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
          </div>
        </div>

        {/* Tlačítka */}
        <div className="flex justify-end gap-3 pt-4 border-t">
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

        <AddRacersDialog
          isOpen={showAddRacers}
          onClose={() => setShowAddRacers(false)}
          availableRacers={availableRacers}
          onAddRacer={handleAddRacer}
        />
      </DialogContent>
    </Dialog>
  );
};