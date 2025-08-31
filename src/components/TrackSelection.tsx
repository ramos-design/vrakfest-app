import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrackOption } from '@/types/tournamentSettings';

interface TrackSelectionProps {
  selectedTrack: TrackOption;
  onTrackSelect: (track: TrackOption) => void;
}

interface TrackInfo {
  id: TrackOption;
  name: string;
  location: string;
  description: string;
}

const tracks: TrackInfo[] = [
  {
    id: 'ostrava',
    name: 'Vřesinská strž',
    location: 'Ostrava',
    description: 'Klasická okružní trať s technickými zatáčkami'
  },
  {
    id: 'hrachovec',
    name: 'Areál Ekorema',
    location: 'Hrachovec',
    description: 'Náročná terénní trať s různorodým povrchem'
  },
  {
    id: 'branky',
    name: 'Závodní okruh',
    location: 'Branky na Moravě',
    description: 'Rychlá trať s dlouhými rovinkami'
  }
];

const TrackMap = ({ track }: { track: TrackInfo }) => {
  const getTrackPath = () => {
    switch (track.id) {
      case 'ostrava':
        return "M20,40 Q60,20 100,40 Q120,60 100,80 Q60,100 20,80 Q10,60 20,40 Z";
      case 'hrachovec':
        return "M20,30 Q40,10 80,30 L100,50 Q120,70 90,90 Q60,100 30,80 Q10,60 20,30 Z";
      case 'branky':
        return "M15,50 Q30,20 70,25 Q110,30 120,50 Q110,70 70,75 Q30,80 15,50 Z";
      default:
        return "M20,40 Q60,20 100,40 Q120,60 100,80 Q60,100 20,80 Q10,60 20,40 Z";
    }
  };

  return (
    <div className="w-full h-20 bg-green-50 rounded-lg border relative overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 140 100" className="absolute inset-0">
        {/* Background grass pattern */}
        <defs>
          <pattern id="grass" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="#86efac"/>
            <circle cx="2" cy="2" r="0.5" fill="#22c55e" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grass)"/>
        
        {/* Track path */}
        <path
          d={getTrackPath()}
          fill="none"
          stroke="#6b7280"
          strokeWidth="4"
          strokeDasharray="2,2"
        />
        
        {/* Start/finish line */}
        <line
          x1="20"
          y1="35"
          x2="20"
          y2="45"
          stroke="#ef4444"
          strokeWidth="2"
        />
        
        {/* Direction arrow */}
        <polygon
          points="35,35 45,40 35,45"
          fill="#3b82f6"
        />
      </svg>
    </div>
  );
};

export const TrackSelection = ({ selectedTrack, onTrackSelect }: TrackSelectionProps) => {
  return (
    <div className="space-y-3">
      {tracks.map(track => (
        <Card 
          key={track.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedTrack === track.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/30'
          }`}
          onClick={() => onTrackSelect(track.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{track.name}</h4>
                  <Badge variant="outline">{track.location}</Badge>
                  {selectedTrack === track.id && (
                    <Badge className="bg-primary text-primary-foreground">Vybrána</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{track.description}</p>
              </div>
              <div className="w-32">
                <TrackMap track={track} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};