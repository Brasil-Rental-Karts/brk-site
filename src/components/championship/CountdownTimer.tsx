import { useState, useEffect } from "react";
import { isEventToday } from "@/utils/championship.utils";

interface Event {
  id: number;
  date: string;
  month: string;
  day: string;
  stage: string;
  location: string;
  time: string;
  status: string;
  streamLink?: string;
}

interface CountdownTimerProps {
  events: Event[];
  selectedYear: string;
}

export const CountdownTimer = ({ events, selectedYear }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [todayEvent, setTodayEvent] = useState<Event | null>(null);

  // Função para converter mês em número
  const getMonthNumber = (monthName: string): number => {
    const months: { [key: string]: number } = {
      'JAN': 0, 'FEV': 1, 'MAR': 2, 'ABR': 3, 'MAI': 4, 'JUN': 5,
      'JUL': 6, 'AGO': 7, 'SET': 8, 'OUT': 9, 'NOV': 10, 'DEZ': 11,
      'JANEIRO': 0, 'FEVEREIRO': 1, 'MARÇO': 2, 'ABRIL': 3, 'MAIO': 4, 'JUNHO': 5,
      'JULHO': 6, 'AGOSTO': 7, 'SETEMBRO': 8, 'OUTUBRO': 9, 'NOVEMBRO': 10, 'DEZEMBRO': 11
    };
    return months[monthName.toUpperCase()] || 0;
  };

  // Função para formatar hora no formato HH:mm
  const formatTime = (time: string): string => {
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      return time.slice(0, 5);
    }
    if (/^\d{1}:\d{2}:\d{2}$/.test(time)) {
      return `0${time.slice(0, 4)}`;
    }
    if (/^\d{2}:\d{2}$/.test(time)) {
      return time;
    }
    if (/^\d{1}:\d{2}$/.test(time)) {
      return `0${time}`;
    }
    if (/^\d{3,4}$/.test(time)) {
      const hours = time.length === 3 ? time.slice(0, 1) : time.slice(0, 2);
      const minutes = time.length === 3 ? time.slice(1) : time.slice(2);
      return `${hours.padStart(2, '0')}:${minutes}`;
    }
    return time;
  };

  // Encontrar a próxima etapa e verificar se há evento hoje
  useEffect(() => {
    const now = new Date();
    const yearNum = parseInt(selectedYear);
    
    // Verificar se há evento hoje
    const todayEventFound = events.find(event => 
      isEventToday(event.date, event.month, selectedYear)
    );
    
    if (todayEventFound) {
      setTodayEvent(todayEventFound);
      setNextEvent(null);
      setTimeLeft(null);
      return;
    }
    
    // Filtrar eventos futuros e ordenar por data
    const futureEvents = events
      .filter(event => {
        const monthNum = getMonthNumber(event.month);
        const dayNum = parseInt(event.date);
        const eventDate = new Date(yearNum, monthNum, dayNum);
        return eventDate >= now;
      })
      .sort((a, b) => {
        const monthA = getMonthNumber(a.month);
        const monthB = getMonthNumber(b.month);
        const dayA = parseInt(a.date);
        const dayB = parseInt(b.date);
        
        const dateA = new Date(yearNum, monthA, dayA);
        const dateB = new Date(yearNum, monthB, dayB);
        
        return dateA.getTime() - dateB.getTime();
      });

    if (futureEvents.length > 0) {
      setNextEvent(futureEvents[0]);
      setTodayEvent(null);
    } else {
      setNextEvent(null);
      setTodayEvent(null);
      setTimeLeft(null);
    }
  }, [events, selectedYear]);

  // Atualizar contador a cada segundo
  useEffect(() => {
    if (!nextEvent) return;

    const updateCountdown = () => {
      const now = new Date();
      const yearNum = parseInt(selectedYear);
      const monthNum = getMonthNumber(nextEvent.month);
      const dayNum = parseInt(nextEvent.date);
      const eventDate = new Date(yearNum, monthNum, dayNum);
      
      // Definir horário da etapa (assumindo 14:00 como padrão se não especificado)
      const [hours, minutes] = nextEvent.time ? formatTime(nextEvent.time).split(':').map(Number) : [14, 0];
      eventDate.setHours(hours, minutes, 0, 0);

      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft(null);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextEvent, selectedYear]);

  // Se há evento hoje, mostrar mensagem especial
  if (todayEvent) {
    return (
      <div className="rounded px-2 py-2 flex flex-col gap-2 items-center w-full max-w-full">
        <div className="text-xs text-primary font-semibold mb-1 text-center">
          Hoje tem Etapa!
        </div>
        <div className="bg-primary/20 rounded-lg px-3 py-2 text-center">
          <div className="text-lg font-bold text-white">{todayEvent.stage}</div>
          <div className="text-xs text-white/70">{formatTime(todayEvent.time)}</div>
        </div>
      </div>
    );
  }

  if (!nextEvent || !timeLeft) {
    return null;
  }

  return (
    <div className="rounded px-2 py-2 flex flex-col gap-2 items-center w-full max-w-full">
      {/* Nome da etapa */}
      <div className="truncate w-full text-xs text-primary font-semibold mb-1 text-center" title={nextEvent.stage}>
        {nextEvent.stage}
      </div>
      {/* Contador visual com blocos */}
      <div className="flex items-center gap-2 justify-center">
        <div className="bg-primary/20 rounded-lg px-3 py-2 min-w-[48px] text-center">
          <div className="text-xl font-bold text-white">{timeLeft.days}</div>
          <div className="text-[10px] text-white/70 uppercase tracking-widest">d</div>
        </div>
        <div className="bg-primary/20 rounded-lg px-3 py-2 min-w-[48px] text-center">
          <div className="text-xl font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="text-[10px] text-white/70 uppercase tracking-widest">h</div>
        </div>
        <div className="bg-primary/20 rounded-lg px-3 py-2 min-w-[48px] text-center">
          <div className="text-xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="text-[10px] text-white/70 uppercase tracking-widest">m</div>
        </div>
        <div className="bg-primary/20 rounded-lg px-3 py-2 min-w-[48px] text-center">
          <div className="text-xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="text-[10px] text-white/70 uppercase tracking-widest">s</div>
        </div>
      </div>
    </div>
  );
}; 