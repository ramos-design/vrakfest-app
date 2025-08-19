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
}

export const RacerForm = ({ racer, onSave, onCancel }: RacerFormProps) => {
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
    <Card className="w-full max-w-md mx-auto shadow-card">
      <CardHeader>
        <CardTitle className="racing-gradient bg-clip-text text-transparent">
          {racer ? 'Upravit jezdce' : 'Přidat jezdce'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName">Jméno</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="lastName">Příjmení</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="startNumber">Startovní číslo</Label>
            <Input
              id="startNumber"
              type="number"
              min="1"
              max="999"
              value={formData.startNumber}
              onChange={(e) => setFormData({ ...formData, startNumber: parseInt(e.target.value) })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="vehicleType">Druh vozidla</Label>
            <Input
              id="vehicleType"
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Kategorie</Label>
            <Select value={formData.category} onValueChange={(value: RacerCategory) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte kategorii" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="points">Aktuální body</Label>
            <Input
              id="points"
              type="number"
              min="0"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 racing-gradient">
              {racer ? 'Upravit' : 'Přidat'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Zrušit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};