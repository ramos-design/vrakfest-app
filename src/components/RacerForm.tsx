import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Racer, RacerCategory } from '@/types/racing';
import { categories } from '@/utils/racingUtils';

interface RacerFormProps {
  racer?: Racer;
  onSave: (racer: Omit<Racer, 'id'>) => void;
  onCancel: () => void;
  compact?: boolean;
}

export const RacerForm = ({ racer, onSave, onCancel, compact = false }: RacerFormProps) => {
  const [formData, setFormData] = useState({
    firstName: racer?.firstName || '',
    lastName: racer?.lastName || '',
    startNumber: racer?.startNumber || 0,
    vehicleType: racer?.vehicleType || '',
    category: racer?.category || 'do 1.6L' as RacerCategory,
    points: racer?.points || 0,
    isActive: racer?.isActive ?? true
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Update form data when racer prop changes
  useEffect(() => {
    if (racer) {
      setFormData({
        firstName: racer.firstName,
        lastName: racer.lastName,
        startNumber: racer.startNumber,
        vehicleType: racer.vehicleType,
        category: racer.category,
        points: racer.points,
        isActive: racer.isActive
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        startNumber: 0,
        vehicleType: '',
        category: 'do 1.6L' as RacerCategory,
        points: 0,
        isActive: true
      });
    }
  }, [racer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    if (!racer) {
      // Reset form after adding new racer
      setFormData({
        firstName: '',
        lastName: '',
        startNumber: 0,
        vehicleType: '',
        category: 'do 1.6L' as RacerCategory,
        points: 0,
        isActive: true
      });
      setIsExpanded(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-4 rounded-lg border border-racing-yellow/30 bg-racing-black/50 hover:bg-racing-black/70 transition-racing ${
          isExpanded ? 'racing-gradient shadow-glow' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isExpanded ? 'bg-racing-black/20' : 'racing-gradient'
            }`}>
              <span className={`font-bold text-sm ${
                isExpanded ? 'text-racing-black' : 'text-racing-black'
              }`}>
                {isExpanded ? '−' : '+'}
              </span>
            </div>
            <div className="text-left">
              <h2 className={`text-lg font-semibold ${
                isExpanded ? 'text-racing-black' : 'racing-gradient-text'
              }`}>
                {racer ? 'Upravit jezdce' : 'Přidat jezdce'}
              </h2>
              <p className={`text-sm ${
                isExpanded ? 'text-racing-black/70' : 'text-muted-foreground'
              }`}>
                {racer ? 'Upravte údaje jezdce' : 'Klikněte pro přidání nového jezdce'}
              </p>
            </div>
          </div>
          <div className={`transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}>
            <svg 
              className={`w-5 h-5 ${
                isExpanded ? 'text-racing-black' : 'text-racing-yellow'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>
      
      {(isExpanded || racer) && (
        <div className="racing-card border border-racing-yellow/30 rounded-lg p-6 shadow-card animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-foreground">Jméno</Label>
              <Input
                id="firstName"
                placeholder="Zadejte jméno"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 bg-racing-black/30 border-racing-yellow/20 text-racing-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Příjmení</Label>
              <Input
                id="lastName"
                placeholder="Zadejte příjmení"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 bg-racing-black/30 border-racing-yellow/20 text-racing-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="startNumber" className="text-sm font-medium text-foreground">Startovní číslo</Label>
              <Input
                id="startNumber"
                type="number"
                min="1"
                max="999"
                placeholder="1-999"
                value={formData.startNumber || ''}
                onChange={(e) => setFormData({ ...formData, startNumber: parseInt(e.target.value) || 0 })}
                className="mt-1 bg-racing-black/30 border-racing-yellow/20 text-racing-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="vehicleType" className="text-sm font-medium text-foreground">Druh vozidla</Label>
              <Input
                id="vehicleType"
                placeholder="Např. Škoda Octavia"
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="mt-1 bg-racing-black/30 border-racing-yellow/20 text-racing-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="text-sm font-medium text-foreground">Kategorie</Label>
              <Select value={formData.category} onValueChange={(value: RacerCategory) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="mt-1 bg-racing-black/30 border-racing-yellow/20 text-racing-white">
                  <SelectValue placeholder="Vyberte kategorii" />
                </SelectTrigger>
                <SelectContent className="bg-racing-black border-racing-yellow/30">
                  {categories.map(category => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      className="text-racing-white hover:bg-racing-yellow/20"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 racing-gradient text-racing-black font-medium shadow-racing hover:shadow-glow">
                {racer ? 'Upravit jezdce' : 'Přidat jezdce'}
              </Button>
              
              {racer && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel} 
                  className="flex-1 border-racing-yellow/30 text-racing-white hover:bg-racing-yellow/10"
                >
                  Zrušit
                </Button>
              )}
              
              {!racer && isExpanded && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsExpanded(false)} 
                  className="flex-1 border-racing-yellow/30 text-racing-white hover:bg-racing-yellow/10"
                >
                  Skrýt
                </Button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};