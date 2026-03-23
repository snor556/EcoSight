import React, { useState } from 'react';
import { 
  Search, Filter, MapPin, Navigation, Plus, Minus, 
  X, Calendar, Crosshair, ChevronRight 
} from 'lucide-react';

export default function MapExplorer() {
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

  // Mock data for map markers
  const sightings = [
    { id: 1, top: '45%', left: '30%', species: 'Blue Jay', confidence: '98%', date: 'Oct 24, 2025', image: 'https://images.unsplash.com/photo-1552728089-5716928236bd?auto=format&fit=crop&w=300&q=80' },
    { id: 2, top: '60%', left: '55%', species: 'Red Fox', confidence: '92%', date: 'Oct 22, 2025', image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=300&q=80' },
    { id: 3, top: '35%', left: '70%', species: 'Monarch Butterfly', confidence: '99%', date: 'Oct 20, 2025', image: 'https://images.unsplash.com/photo-1541426062085-78097d7ee46a?auto=format&fit=crop&w=300&q=80' },
  ];

  // Mock data for clusters (dense areas)
  const clusters = [
    { id: 'c1', top: '50%', left: '45%', count: 12 },
    { id: 'c2', top: '25%', left: '60%', count: 8 },
    { id: 'c3', top: '75%', left: '35%', count: 34 },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-80px)] bg-sky-50 overflow-hidden rounded-3xl border border-gray-200 shadow-sm animate-in fade-in duration-500 font-sans">
      
      {/* Simulated Map Background (Using a stylized repeating pattern for the prototype) */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M100 50A50 50 0 1 1 0 50a50 50 0 0 1 100 0z' stroke='%2310b981' stroke-width='0.5' fill='none' opacity='0.2'/%3E%3Cpath d='M50 0v100M0 50h100' stroke='%2310b981' stroke-width='0.5' opacity='0.2'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px'
        }}
      ></div>

      {/* RENDER CLUSTERS */}
      {clusters.map(cluster => (
        <div 
          key={cluster.id}
          className="absolute z-10 w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse cursor-pointer hover:bg-emerald-500/30 transition-colors"
          style={{ top: cluster.top, left: cluster.left, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white">
            {cluster.count}
          </div>
        </div>
      ))}

      {/* RENDER INDIVIDUAL MARKERS */}
      {sightings.map(sighting => (
        <div 
          key={sighting.id}
          onClick={() => setSelectedSighting(sighting)}
          className="absolute z-20 cursor-pointer group"
          style={{ top: sighting.top, left: sighting.left, transform: 'translate(-50%, -100%)' }}
        >
          <div className="relative">
            <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform ${selectedSighting?.id === sighting.id ? 'bg-amber-500 scale-125' : 'bg-emerald-600 group-hover:scale-110'}`}>
              <MapPin size={16} className="text-white" />
            </div>
            {/* Map Pin Point */}
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b border-white ${selectedSighting?.id === sighting.id ? 'bg-amber-500' : 'bg-emerald-600'}`}></div>
          </div>
        </div>
      ))}

      {/* FLOATING FILTER PANEL (Left Side) */}
      {showFilters && (
        <div className="absolute top-6 left-6 z-30 w-80 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Filter size={18} /> Map Filters
            </h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search Species</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input type="text" placeholder="e.g. Blue Jay" className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date Range</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Distance Radius</label>
              <span className="text-xs font-bold text-emerald-600">50 km</span>
            </div>
            <input type="range" className="w-full accent-emerald-500" min="1" max="100" defaultValue="50" />
          </div>

          <button className="w-full bg-emerald-50 text-emerald-700 py-2.5 rounded-lg font-bold hover:bg-emerald-100 transition-colors mt-2 text-sm">
            Apply Filters
          </button>
        </div>
      )}

      {/* FILTER TOGGLE BUTTON (If panel is hidden) */}
      {!showFilters && (
        <button 
          onClick={() => setShowFilters(true)}
          className="absolute top-6 left-6 z-30 bg-white p-3 rounded-xl shadow-md border border-gray-100 text-gray-700 hover:text-emerald-600 transition-colors"
        >
          <Filter size={20} />
        </button>
      )}

      {/* MAP CONTROLS (Right Side) */}
      <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-3">
        <button className="bg-white p-3 rounded-xl shadow-md border border-gray-100 text-gray-700 hover:text-emerald-600 transition-colors" title="My Location">
          <Crosshair size={20} />
        </button>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col overflow-hidden">
          <button className="p-3 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors border-b border-gray-100">
            <Plus size={20} />
          </button>
          <button className="p-3 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors">
            <Minus size={20} />
          </button>
        </div>
      </div>

      {/* SIGHTING POPUP CARD */}
      {selectedSighting && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="relative h-40">
            <img src={selectedSighting.image} alt={selectedSighting.species} className="w-full h-full object-cover" />
            <button 
              onClick={() => setSelectedSighting(null)}
              className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              {selectedSighting.confidence} Match
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedSighting.species}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Calendar size={14} /> {selectedSighting.date}
            </div>
            <button className="w-full flex justify-between items-center bg-gray-50 hover:bg-emerald-50 border border-gray-200 text-gray-700 hover:text-emerald-700 hover:border-emerald-200 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm group">
              View Species Details 
              <ChevronRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}