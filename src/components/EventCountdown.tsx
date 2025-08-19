import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface EventSettings {
  eventName: string;
  eventDate: string;
  eventTime: string;
  ctaText: string;
  ctaLink: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function EventCountdown() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [settings, setSettings] = useState<EventSettings>(() => {
    const saved = localStorage.getItem('vrakfest-event-settings');
    return saved ? JSON.parse(saved) : {
      eventName: 'VrakFest Racing Championship',
      eventDate: '2024-12-31',
      eventTime: '18:00',
      ctaText: 'Register Now',
      ctaLink: '#'
    };
  });

  const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const difference = target - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    const targetDate = new Date(`${settings.eventDate}T${settings.eventTime}`);
    
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.eventDate, settings.eventTime]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('vrakfest-event-settings', JSON.stringify(settings));
    setIsOpen(false);
    toast({
      title: "Nastavení uloženo",
      description: "Údaje o události byly úspěšně aktualizovány.",
    });
  };

  const formatDateTime = () => {
    const date = new Date(`${settings.eventDate}T${settings.eventTime}`);
    return date.toLocaleString('cs-CZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCtaClick = () => {
    if (settings.ctaLink && settings.ctaLink !== '#') {
      window.open(settings.ctaLink, '_blank');
    }
  };

  return (
    <div className="racing-gradient rounded-lg p-8 text-center shadow-glow relative">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 h-8 w-8 text-racing-black hover:bg-racing-black/10"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="racing-card">
          <DialogHeader>
            <DialogTitle className="racing-gradient-text">Nastavení události</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <Label htmlFor="eventName" className="text-racing-white">Název události</Label>
              <Input
                id="eventName"
                value={settings.eventName}
                onChange={(e) => setSettings(prev => ({ ...prev, eventName: e.target.value }))}
                className="racing-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate" className="text-racing-white">Datum</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={settings.eventDate}
                  onChange={(e) => setSettings(prev => ({ ...prev, eventDate: e.target.value }))}
                  className="racing-input"
                />
              </div>
              <div>
                <Label htmlFor="eventTime" className="text-racing-white">Čas</Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={settings.eventTime}
                  onChange={(e) => setSettings(prev => ({ ...prev, eventTime: e.target.value }))}
                  className="racing-input"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="ctaText" className="text-racing-white">Text tlačítka</Label>
              <Input
                id="ctaText"
                value={settings.ctaText}
                onChange={(e) => setSettings(prev => ({ ...prev, ctaText: e.target.value }))}
                className="racing-input"
              />
            </div>
            <div>
              <Label htmlFor="ctaLink" className="text-racing-white">Odkaz tlačítka</Label>
              <Input
                id="ctaLink"
                value={settings.ctaLink}
                onChange={(e) => setSettings(prev => ({ ...prev, ctaLink: e.target.value }))}
                placeholder="https://..."
                className="racing-input"
              />
            </div>
            <Button type="submit" className="w-full racing-btn-primary">
              Uložit nastavení
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="text-racing-black">
        <div className="inline-block bg-racing-black/10 rounded-full px-4 py-1 text-xs font-medium mb-4">
          nadcházející událost
        </div>
        
        <h2 className="text-2xl font-bold mb-2">{settings.eventName}</h2>
        
        <p className="text-sm opacity-75 mb-6">{formatDateTime()}</p>
        
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-racing-black/10 rounded-lg p-3">
              <div className="text-3xl font-bold">{timeRemaining.days}</div>
              <div className="text-sm">Dní</div>
            </div>
            <div className="bg-racing-black/10 rounded-lg p-3">
              <div className="text-3xl font-bold">{timeRemaining.hours}</div>
              <div className="text-sm">Hodin</div>
            </div>
            <div className="bg-racing-black/10 rounded-lg p-3">
              <div className="text-3xl font-bold">{timeRemaining.minutes}</div>
              <div className="text-sm">Minut</div>
            </div>
            <div className="bg-racing-black/10 rounded-lg p-3">
              <div className="text-3xl font-bold">{timeRemaining.seconds}</div>
              <div className="text-sm">Sekund</div>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleCtaClick}
          className="bg-racing-black text-racing-white hover:bg-racing-black/90 text-base px-8 py-3"
          disabled={!settings.ctaLink || settings.ctaLink === '#'}
        >
          {settings.ctaText}
        </Button>
      </div>
    </div>
  );
}