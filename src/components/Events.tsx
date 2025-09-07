import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Trophy, Users, Edit, Trash2, Plus, FileText, Clock3 } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { EventForm } from '@/components/EventForm';
import { Event, EventType, EVENT_TYPES } from '@/types/events';

export function Events() {
  const { getUpcomingEvents, getPastEvents, addEvent, updateEvent, deleteEvent } = useEvents();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Opravdu chcete smazat tuto událost?')) {
      deleteEvent(eventId);
    }
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const getEventTypeLabel = (eventTypes: EventType[]) => {
    return eventTypes.map(type => 
      EVENT_TYPES.find(et => et.value === type)?.label || type
    ).join(', ');
  };

  const renderEventCard = (event: Event, isUpcoming: boolean) => (
    <Card key={event.id} className={`racing-card ${isUpcoming ? 'border-racing-yellow/20' : 'border-racing-white/10'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={isUpcoming ? 'racing-gradient-text' : 'text-racing-white'}>
            {event.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isUpcoming ? 'secondary' : 'outline'} 
              className={isUpcoming 
                ? 'bg-racing-yellow/20 text-racing-yellow' 
                : 'border-racing-white/20 text-racing-white'
              }
            >
              {event.status === 'upcoming' ? 'Nadcházející' : 
               event.status === 'completed' ? 'Dokončeno' : 'Zrušeno'}
            </Badge>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEditEvent(event)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteEvent(event.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className={`h-4 w-4 ${isUpcoming ? 'text-racing-yellow' : 'text-racing-white/60'}`} />
            <span className="text-sm text-muted-foreground">{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`h-4 w-4 ${isUpcoming ? 'text-racing-yellow' : 'text-racing-white/60'}`} />
            <span className="text-sm text-muted-foreground">{event.startTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className={`h-4 w-4 ${isUpcoming ? 'text-racing-yellow' : 'text-racing-white/60'}`} />
            <span className="text-sm text-muted-foreground">{event.participantCount} účastníků</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-racing-yellow" />
            <span className="text-sm text-muted-foreground">
              {event.winner || event.prize || 'Není stanoveno'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-muted/20">
          <div className="flex items-center gap-2">
            <Clock3 className={`h-4 w-4 ${isUpcoming ? 'text-racing-yellow' : 'text-racing-white/60'}`} />
            <span className="text-sm text-muted-foreground">
              Začátek: {event.startTime} | {getEventTypeLabel(event.eventTypes)}
            </span>
          </div>
          {event.description && (
            <div className="flex items-center gap-2">
              <FileText className={`h-4 w-4 ${isUpcoming ? 'text-racing-yellow' : 'text-racing-white/60'}`} />
              <span className="text-sm text-muted-foreground truncate">
                {event.description}
              </span>
            </div>
          )}
        </div>

        {event.schedule && (
          <div className="pt-2 border-t border-muted/20">
            <h4 className="text-sm font-medium mb-1">Harmonogram:</h4>
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {event.schedule}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (showForm) {
    return (
      <EventForm
        event={editingEvent || undefined}
        onSave={handleSaveEvent}
        onCancel={handleCancelForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold racing-gradient-text">Správa událostí</h1>
        <Button onClick={handleAddEvent} className="racing-button">
          <Plus className="h-4 w-4 mr-2" />
          Přidat událost
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold racing-gradient-text mb-4">Nadcházející události</h2>
        <div className="grid gap-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => renderEventCard(event, true))
          ) : (
            <Card className="racing-card border-racing-yellow/20">
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Žádné nadcházející události</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold racing-gradient-text mb-4">Proběhlé události</h2>
        <div className="grid gap-4">
          {pastEvents.length > 0 ? (
            pastEvents.map((event) => renderEventCard(event, false))
          ) : (
            <Card className="racing-card border-racing-white/10">
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Žádné proběhlé události</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}