import React, { useState, useEffect } from 'react';
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
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [settings] = useState<EventSettings>({
    eventName: 'VrakFest Racing Championship',
    eventDate: '2024-12-31',
    eventTime: '18:00',
    ctaText: 'Register Now',
    ctaLink: '#'
  });
  const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const difference = target - now;
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
      const minutes = Math.floor(difference % (1000 * 60 * 60) / (1000 * 60));
      const seconds = Math.floor(difference % (1000 * 60) / 1000);
      return {
        days,
        hours,
        minutes,
        seconds
      };
    }
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  };
  useEffect(() => {
    const targetDate = new Date(`${settings.eventDate}T${settings.eventTime}`);
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.eventDate, settings.eventTime]);
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
  return <div className="racing-gradient rounded-lg p-8 text-center shadow-glow relative py-[33px]">
      <div className="text-racing-black px-[2px] py-0 my-0 mx-0">
        <div className="flex flex-col items-center mb-3 px-0 my-0 py-[2px]">
          <div className="bg-racing-black rounded-full px-3 py-1 text-sm font-medium text-racing-white mb-1">
            Nadcházející událost
          </div>
          
          <h2 className="text-2xl font-bold mb-1 px-0">{settings.eventName}</h2>
          
          <p className="text-sm opacity-75">{formatDateTime()}</p>
        </div>
        
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
    </div>;
}