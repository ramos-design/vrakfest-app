import { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">+</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          {racer ? 'Upravit jezdce' : 'Přidat jezdce'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium text-foreground">Jméno</Label>
          <Input
            id="firstName"
            placeholder="Zadejte jméno"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="mt-1"
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
            className="mt-1"
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
            className="mt-1"
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
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="category" className="text-sm font-medium text-foreground">Kategorie</Label>
          <Select value={formData.category} onValueChange={(value: RacerCategory) => setFormData({ ...formData, category: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Vyberte kategorii" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button type="submit" className="w-full racing-gradient text-white font-medium">
          {racer ? 'Upravit jezdce' : 'Přidat jezdce'}
        </Button>
        
        {racer && (
          <Button type="button" variant="outline" onClick={onCancel} className="w-full">
            Zrušit
          </Button>
        )}
      </form>
    </div>
  );
};