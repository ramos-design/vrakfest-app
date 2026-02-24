import React, { useState, useEffect } from 'react';
interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const DEFAULT_SETTINGS = {
  eventName: 'VrakFest Ostrava',
  eventDate: '2025-09-13',
  eventTime: '09:00',
  ctaText: 'Registruj se',
  ctaLink: '#'
};

export function EventCountdown() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
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
    const targetDate = new Date(`${DEFAULT_SETTINGS.eventDate}T${DEFAULT_SETTINGS.eventTime}`);
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = () => {
    const date = new Date(`${DEFAULT_SETTINGS.eventDate}T${DEFAULT_SETTINGS.eventTime}`);
    return date.toLocaleString('cs-CZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <div className="bg-[#111] border border-racing-yellow border-t-2 p-4 md:p-5 relative overflow-hidden group">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_5px_red]"></span>
            <span className="font-tech text-red-500 uppercase text-[10px] tracking-[0.2em] font-bold">Live</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bebas text-white tracking-wide uppercase leading-none mb-1">
            <span className="text-racing-yellow">{DEFAULT_SETTINGS.eventName.split(' ')[0]}</span> {DEFAULT_SETTINGS.eventName.split(' ').slice(1).join(' ')}
          </h2>
          <p className="font-tech text-white/50 text-[10px] md:text-xs uppercase tracking-wider">
            {formatDateTime()}
          </p>
        </div>

        <div className="flex flex-row justify-center gap-2 md:gap-4">
          <TimeUnit value={timeRemaining.days} label="Dní" />
          <TimeUnit value={timeRemaining.hours} label="Hod" />
          <TimeUnit value={timeRemaining.minutes} label="Min" />
          <TimeUnit value={timeRemaining.seconds} label="Sec" isLast />
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label, isLast }: { value: number, label: string, isLast?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`bg-[#222] border border-white/10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-1 transition-colors duration-300 ${isLast ? 'text-racing-yellow border-racing-yellow/50 shadow-[0_0_10px_rgba(244,206,20,0.2)]' : 'text-white'}`}>
        <div className="text-xl md:text-2xl font-bebas tracking-wider">
          {String(value).padStart(2, '0')}
        </div>
      </div>
      <span className="font-tech text-[8px] md:text-[9px] text-white/30 uppercase tracking-widest">{label}</span>
    </div>
  );
}