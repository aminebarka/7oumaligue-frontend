import React from 'react';

interface Event {
  id: string;
  type: 'goal' | 'penalty' | 'own_goal' | 'yellow' | 'red' | 'substitution';
  team: 'home' | 'away';
  playerName: string;
  time: string;
  score?: string; // ex: "1-0"
  detail?: string; // ex: "Penalty", "OG"
}

interface MatchEventsTimelineProps {
  events: Event[];
}

const iconForEvent = (type: string) => {
  switch (type) {
    case 'goal': return '⚽';
    case 'penalty': return '⚽ (Pen)';
    case 'own_goal': return '🥅 (OG)';
    case 'yellow': return '🟨';
    case 'red': return '🟥';
    case 'substitution': return '🔄';
    default: return '';
  }
};

const MatchEventsTimeline: React.FC<MatchEventsTimelineProps> = ({ events }) => (
  <div className="relative py-6">
    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200" style={{ transform: 'translateX(-50%)' }} />
    <ul className="space-y-6 relative z-10">
      {events.map((event) => (
        <li key={event.id} className="flex items-center justify-between">
          {/* Home events left, away events right */}
          {event.team === 'home' ? (
            <>
              <div className="flex items-center space-x-2 w-1/2 justify-end">
                <span className="font-bold text-gray-700">{event.time}'</span>
                <span className="text-lg">{iconForEvent(event.type)}</span>
                <span className="font-medium">{event.playerName}</span>
                {event.detail && <span className="text-xs text-gray-500 ml-1">({event.detail})</span>}
                {event.score && <span className="ml-2 text-xs text-pink-600 font-bold">{event.score}</span>}
              </div>
              <div className="w-1/2" />
            </>
          ) : (
            <>
              <div className="w-1/2" />
              <div className="flex items-center space-x-2 w-1/2">
                <span className="font-medium">{event.playerName}</span>
                {event.detail && <span className="text-xs text-gray-500 ml-1">({event.detail})</span>}
                <span className="text-lg">{iconForEvent(event.type)}</span>
                <span className="font-bold text-gray-700">{event.time}'</span>
                {event.score && <span className="ml-2 text-xs text-pink-600 font-bold">{event.score}</span>}
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default MatchEventsTimeline; 