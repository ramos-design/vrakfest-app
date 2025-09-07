import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Event, EventType, EVENT_TYPES } from '@/types/events';

interface EventFormProps {
  event?: Event;
  onSave: (eventData: Omit<Event, 'id'>) => void;
  onCancel: () => void;
}

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    participantCount: 0,
    eventType: 'turnaj' as EventType,
    startTime: '',
    description: '',
    schedule: '',
    status: 'upcoming' as 'upcoming' | 'completed' | 'cancelled',
    prize: ''
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        date: event.date,
        time: event.time,
        participantCount: event.participantCount,
        eventType: event.eventType,
        startTime: event.startTime,
        description: event.description,
        schedule: event.schedule,
        status: event.status,
        prize: event.prize || ''
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="racing-card">
      <CardHeader>
        <CardTitle className="racing-gradient-text">
          {event ? 'Upravit událost' : 'Přidat novou událost'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Název události</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Název události"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="date">Datum události</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="time">Čas události</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="participantCount">Počet jezdců</Label>
              <Input
                id="participantCount"
                type="number"
                min="1"
                value={formData.participantCount}
                onChange={(e) => handleInputChange('participantCount', parseInt(e.target.value))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="eventType">Typ soutěže</Label>
              <Select value={formData.eventType} onValueChange={(value: EventType) => handleInputChange('eventType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="startTime">Čas začátku</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="prize">Cena (nepovinné)</Label>
              <Input
                id="prize"
                value={formData.prize}
                onChange={(e) => handleInputChange('prize', e.target.value)}
                placeholder="např. 50,000 Kč"
              />
            </div>

            <div>
              <Label htmlFor="status">Stav události</Label>
              <Select value={formData.status} onValueChange={(value: 'upcoming' | 'completed' | 'cancelled') => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Nadcházející</SelectItem>
                  <SelectItem value="completed">Dokončeno</SelectItem>
                  <SelectItem value="cancelled">Zrušeno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Popis události</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Popis události..."
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="schedule">Harmonogram programu</Label>
            <Textarea
              id="schedule"
              value={formData.schedule}
              onChange={(e) => handleInputChange('schedule', e.target.value)}
              placeholder="18:00 - Registrace&#10;19:00 - Rozjezdy&#10;20:30 - Finále"
              rows={4}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="racing-button">
              {event ? 'Uložit změny' : 'Vytvořit událost'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Zrušit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}