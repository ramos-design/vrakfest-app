import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Trophy, Users } from 'lucide-react';

export function Events() {
  const upcomingEvents = [
    {
      id: 1,
      name: 'VrakFest Championship 2024',
      date: '2024-12-31',
      time: '18:00',
      status: 'upcoming',
      participants: 24,
      prize: '50,000 Kč'
    },
    {
      id: 2,
      name: 'Spring Racing Cup',
      date: '2025-03-15',
      time: '16:30',
      status: 'upcoming',
      participants: 18,
      prize: '30,000 Kč'
    }
  ];

  const pastEvents = [
    {
      id: 3,
      name: 'Winter Championship 2023',
      date: '2023-12-20',
      time: '19:00',
      status: 'completed',
      participants: 32,
      winner: 'Jan Novák',
      prize: '40,000 Kč'
    },
    {
      id: 4,
      name: 'Autumn Classic',
      date: '2023-10-15',
      time: '17:00',
      status: 'completed',
      participants: 20,
      winner: 'Petra Svobodová',
      prize: '25,000 Kč'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold racing-gradient-text mb-4">Nadcházející události</h2>
        <div className="grid gap-4">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="racing-card border-racing-yellow/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="racing-gradient-text">{event.name}</CardTitle>
                  <Badge variant="secondary" className="bg-racing-yellow/20 text-racing-yellow">
                    Nadcházející
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-racing-yellow" />
                    <span className="text-sm text-muted-foreground">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-racing-yellow" />
                    <span className="text-sm text-muted-foreground">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-racing-yellow" />
                    <span className="text-sm text-muted-foreground">{event.participants} účastníků</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-racing-yellow" />
                    <span className="text-sm text-muted-foreground">{event.prize}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold racing-gradient-text mb-4">Proběhlé události</h2>
        <div className="grid gap-4">
          {pastEvents.map((event) => (
            <Card key={event.id} className="racing-card border-racing-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-racing-white">{event.name}</CardTitle>
                  <Badge variant="outline" className="border-racing-white/20 text-racing-white">
                    Dokončeno
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-racing-white/60" />
                    <span className="text-sm text-muted-foreground">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-racing-white/60" />
                    <span className="text-sm text-muted-foreground">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-racing-white/60" />
                    <span className="text-sm text-muted-foreground">{event.participants} účastníků</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-racing-yellow" />
                    <span className="text-sm font-medium text-racing-yellow">{event.winner}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{event.prize}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}