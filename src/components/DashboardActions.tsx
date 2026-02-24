import { Flag, Gauge, BarChart3, Car, ShoppingCart, Search, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ActionCardProps {
  icon: React.ComponentType<any>;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  isStartButton?: boolean;
}

function ActionCard({ icon: Icon, label, isActive = false, onClick, isStartButton = false }: ActionCardProps) {
  const getCardStyles = () => {
    if (isStartButton) {
      return isActive
        ? 'bg-racing-yellow text-black shadow-[0_0_20px_theme(colors.racing.yellow)]'
        : 'bg-transparent border border-racing-yellow text-racing-yellow hover:bg-racing-yellow hover:text-black hover:shadow-[0_0_20px_theme(colors.racing.yellow)]';
    }
    return isActive
      ? 'bg-white text-black'
      : 'bg-[#111] border border-white/10 text-white/70 hover:text-white hover:border-racing-yellow/50 hover:bg-[#1a1a1a]';
  };

  return (
    <div
      className={`group relative p-4 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${getCardStyles()}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon className={`h-6 w-6 mb-1 ${isStartButton ? '' : 'text-racing-yellow group-hover:text-white transition-colors'}`} />
        <span className="font-bebas text-lg tracking-wide uppercase leading-none">{label}</span>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-racing-yellow/0 group-hover:border-racing-yellow transition-colors"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-racing-yellow/0 group-hover:border-racing-yellow transition-colors"></div>
    </div>
  );
}

interface DashboardActionsProps {
  onStartTournament?: () => void;
  onViewControl?: () => void;
  onViewTournament?: () => void;
  onViewCommunication?: () => void;
  onViewStatistics?: () => void;
  onViewMarketplace?: () => void;
  isTournamentActive?: boolean;
}

export function DashboardActions({ onStartTournament, onViewControl, onViewTournament, onViewCommunication, onViewStatistics, onViewMarketplace, isTournamentActive = false }: DashboardActionsProps) {
  const actions = [
    { icon: isTournamentActive ? Search : Flag, label: isTournamentActive ? 'RACE PROGRESS' : 'START RACE', isActive: isTournamentActive, onClick: isTournamentActive ? onViewTournament : onStartTournament, isStartButton: true },
    { icon: Gauge, label: 'CONTROL', isActive: false, onClick: onViewControl },
    { icon: BarChart3, label: 'STATS', isActive: false, onClick: onViewStatistics },
    { icon: Car, label: 'DERBY', isActive: false },
    { icon: MessageSquare, label: 'COMMS', isActive: false, onClick: onViewCommunication },
    { icon: ShoppingCart, label: 'MARKET', isActive: false, onClick: onViewMarketplace },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {actions.map((action, index) => (
        <ActionCard
          key={index}
          icon={action.icon}
          label={action.label}
          isActive={action.isActive}
          onClick={action.onClick}
          isStartButton={action.isStartButton}
        />
      ))}
    </div>
  );
}