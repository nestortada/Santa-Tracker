import React, { useState } from 'react';
import { Stop } from '../types';
import { CheckCircle2, Circle, Clock, Gift, Plus, ChevronLeft, ChevronRight, Map } from 'lucide-react';
import { geocodeLocation } from '../services/geminiService';

interface MissionControlProps {
  stops: Stop[];
  onAddStop: (stopData: Pick<Stop, 'city' | 'country' | 'kidName' | 'gift' | 'coordinates'>) => void;
  currentStopId: string | null;
}

const MissionControl: React.FC<MissionControlProps> = ({ stops, onAddStop, currentStopId }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ city: '', country: '', kidName: '', gift: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Geocode
    const coords = await geocodeLocation(`${form.city}, ${form.country}`);
    
    if (coords) {
        onAddStop({
            ...form,
            coordinates: coords
        });
        setForm({ city: '', country: '', kidName: '', gift: '' });
        setIsAdding(false);
    } else {
        alert("Could not find location. Please check spelling.");
    }
    setLoading(false);
  };

  return (
    <>
        {/* Sidebar Container - Logic: Moves off-screen based on isOpen state */}
        <div 
            className={`absolute top-4 left-4 bottom-4 w-80 sm:w-96 flex flex-col z-10 transition-transform duration-500 ease-in-out pointer-events-none ${isOpen ? 'translate-x-0' : '-translate-x-[calc(100%+16px)]'}`}
        >
            {/* The Panel Content */}
            <div className="flex-1 flex flex-col bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent flex items-center gap-2">
                                <Gift className="text-red-500 w-5 h-5" />
                                Santa Tracker
                            </h1>
                            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mt-1">North Pole Command</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" title="System Online"></div>
                    </div>
                </div>

                {/* Stop List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {stops.map((stop) => {
                    const isCurrent = stop.id === currentStopId;
                    const isPast = stop.status === 'delivered';
                    
                    return (
                        <div 
                        key={stop.id} 
                        className={`relative p-3 rounded-lg border transition-all duration-300 group ${
                            isCurrent 
                            ? 'bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                        }`}
                        >
                        {isCurrent && (
                            <span className="absolute top-2 right-2 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        )}
                        
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                {isPast ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : 
                                isCurrent ? <Clock className="w-4 h-4 text-amber-400 animate-spin-slow" /> : 
                                <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className={`font-medium ${isCurrent ? 'text-white' : 'text-slate-200'}`}>{stop.city}</h3>
                                </div>
                                <p className="text-xs font-mono text-slate-500 uppercase">{stop.country}</p>
                                
                                <div className="mt-2 pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-slate-400">
                                        <span className="text-slate-600 block text-[9px] uppercase tracking-wide">Kid</span>
                                        {stop.kidName}
                                    </div>
                                    <div className="text-slate-400">
                                         <span className="text-slate-600 block text-[9px] uppercase tracking-wide">Request</span>
                                        {stop.gift}
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    );
                    })}
                </div>

                {/* Add Form Area */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                    {!isAdding ? (
                        <button 
                            onClick={() => setIsAdding(true)}
                            className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/30 text-sm border border-white/10"
                        >
                            <Plus className="w-4 h-4" /> New Destination
                        </button>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-2 animate-in slide-in-from-bottom-2">
                            <div className="grid grid-cols-2 gap-2">
                                <input 
                                    required
                                    placeholder="City" 
                                    value={form.city}
                                    onChange={e => setForm({...form, city: e.target.value})}
                                    className="bg-white/5 border border-white/10 rounded p-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:bg-white/10 outline-none transition-colors"
                                />
                                <input 
                                    required
                                    placeholder="Country" 
                                    value={form.country}
                                    onChange={e => setForm({...form, country: e.target.value})}
                                    className="bg-white/5 border border-white/10 rounded p-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:bg-white/10 outline-none transition-colors"
                                />
                            </div>
                            <input 
                                required
                                placeholder="Child's Name" 
                                value={form.kidName}
                                onChange={e => setForm({...form, kidName: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded p-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:bg-white/10 outline-none transition-colors"
                            />
                            <input 
                                required
                                placeholder="Requested Gift" 
                                value={form.gift}
                                onChange={e => setForm({...form, gift: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded p-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:bg-white/10 outline-none transition-colors"
                            />
                            <div className="flex gap-2 pt-1">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors border border-white/5"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors disabled:opacity-50 shadow-lg shadow-emerald-900/20 border border-white/10"
                                >
                                    {loading ? 'Processing...' : 'Add Route'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Toggle Button (Attached to right side) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-8 -right-10 pointer-events-auto bg-slate-900/80 backdrop-blur-md text-white w-8 h-10 rounded-r-lg border-y border-r border-white/20 flex items-center justify-center hover:bg-red-600 hover:border-red-500 transition-all shadow-xl"
                title={isOpen ? "Hide Panel" : "Show Panel"}
            >
                {isOpen ? <ChevronLeft className="w-5 h-5" /> : <Map className="w-5 h-5" />}
            </button>
        </div>

        {/* Minimized view indicator (optional, just to show something is happening when closed) */}
        {!isOpen && (
             <div className="absolute top-8 left-0 pl-4 pointer-events-none animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/10 shadow-2xl">
                   <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Full Map View</p>
                </div>
             </div>
        )}
    </>
  );
};

export default MissionControl;
