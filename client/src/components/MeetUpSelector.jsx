import React, { useState } from 'react';
import { MapPin, Clock, Check } from 'lucide-react';

const PRESET_LOCATIONS = [
  { name: 'Central Library', icon: '📚' },
  { name: 'SAC Arena (Sports Complex)', icon: '⚽' },
  { name: 'Main Campus Gate', icon: '🏛️' },
  { name: 'Hostel Gate', icon: '🏢' },
  { name: 'Academic Area (Canteen)', icon: '☕' },
];

export const MeetUpSelector = ({ onSelectLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [meetTime, setMeetTime] = useState('5:00 PM Today');

  const handleSelect = (locName) => {
    setSelectedLocation(locName);
    onSelectLocation({ location: locName, time: meetTime });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customLocation.trim()) {
      setSelectedLocation(customLocation.trim());
      onSelectLocation({ location: customLocation.trim(), time: meetTime });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 text-xs space-y-3 shadow-xl">
      <div className="flex items-center gap-1.5 font-bold text-cyan-400">
        <MapPin className="w-4 h-4" /> Propose Campus Meet-up Spot
      </div>

      <p className="text-slate-400 text-[11px]">
        Select a safe, public campus location to exchange item:
      </p>

      {/* Preset Chips */}
      <div className="flex flex-wrap gap-2">
        {PRESET_LOCATIONS.map((loc) => (
          <button
            key={loc.name}
            type="button"
            onClick={() => handleSelect(loc.name)}
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border transition-all ${
              selectedLocation === loc.name
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-cyan-500/50'
            }`}
          >
            <span>{loc.icon}</span>
            <span>{loc.name}</span>
            {selectedLocation === loc.name && <Check className="w-3.5 h-3.5 ml-1" />}
          </button>
        ))}
      </div>

      {/* Custom Location Input */}
      <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-1">
        <input
          type="text"
          placeholder="Or type custom location (e.g. Lab 302)..."
          value={customLocation}
          onChange={(e) => setCustomLocation(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 font-semibold text-slate-200 transition-colors"
        >
          Set
        </button>
      </form>

      {/* Time input */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-400">Suggested Time:</span>
        <input
          type="text"
          value={meetTime}
          onChange={(e) => {
            setMeetTime(e.target.value);
            if (selectedLocation) {
              onSelectLocation({ location: selectedLocation, time: e.target.value });
            }
          }}
          placeholder="e.g. 5:00 PM Today"
          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px] focus:outline-none"
        />
      </div>
    </div>
  );
};
