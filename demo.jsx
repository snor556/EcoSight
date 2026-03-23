import React, { useState } from 'react';
import { 
  Leaf, Search, Bell, User, LayoutDashboard, UploadCloud, 
  Map as MapIcon, Library, Settings, MapPin, Calendar, CheckCircle2, AlertTriangle
} from 'lucide-react';

export default function EcoSightApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, complete

  return (
    <div className="min-h-screen bg-green-50/30 flex text-gray-800 font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-green-100 flex flex-col shadow-sm hidden md:flex">
        <div className="p-6 flex items-center gap-3 text-emerald-700">
          <Leaf size={28} className="fill-emerald-600" />
          <span className="text-2xl font-bold tracking-tight">EcoSight</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} label="Dashboard" />
          <NavItem active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={<UploadCloud />} label="Upload Sighting" />
          <NavItem active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<MapIcon />} label="Map Explorer" />
          <NavItem active={activeTab === 'library'} onClick={() => setActiveTab('library')} icon={<Library />} label="Species Library" />
        </nav>

        <div className="p-4 border-t border-green-50">
          <NavItem active={false} icon={<Settings />} label="Settings" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Navigation Bar */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-green-100 p-4 flex justify-between items-center shadow-sm">
          <div className="flex-1 max-w-xl relative hidden sm:block">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search species, locations, or users..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 text-gray-500 hover:text-emerald-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>
            <div className="h-10 w-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold cursor-pointer border-2 border-white shadow-sm">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
          {activeTab === 'upload' && <UploadView uploadState={uploadState} setUploadState={setUploadState} />}
          {activeTab === 'map' && <div className="text-center text-gray-500 mt-20">Interactive Map Component Goes Here</div>}
          {activeTab === 'library' && <div className="text-center text-gray-500 mt-20">Species Library Goes Here</div>}
        </div>
      </main>
    </div>
  );
}

/* --- Sub-components --- */

function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
        ? 'bg-emerald-50 text-emerald-700 font-medium' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
      }`}
    >
      {React.cloneElement(icon, { size: 20 })}
      <span>{label}</span>
    </button>
  );
}

function DashboardView({ setActiveTab }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Explorer!</h1>
          <p className="text-gray-500">You've helped identify 12 new species this month.</p>
        </div>
        <button 
          onClick={() => setActiveTab('upload')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-emerald-200 font-medium transition-all flex items-center gap-2"
        >
          <UploadCloud size={20} />
          New Sighting
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Sightings" value="142" icon={<MapPin className="text-sky-500"/>} bg="bg-sky-50" />
        <StatCard title="Species Identified" value="48" icon={<CheckCircle2 className="text-emerald-500"/>} bg="bg-emerald-50" />
        <StatCard title="Rare Sightings" value="3" icon={<AlertTriangle className="text-amber-500"/>} bg="bg-amber-50" />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h2>
        <div className="text-center py-12 text-gray-400">
          Activity feed list will populate here...
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-xl ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function UploadView({ uploadState, setUploadState }) {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Identify a Species</h1>
      <p className="text-gray-500 mb-8">Upload an image and let our AI assist you with identification.</p>

      {uploadState === 'idle' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Upload Area */}
          <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/30 rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-colors hover:bg-emerald-50/80 cursor-pointer min-h-[400px]">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <UploadCloud size={32} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Drag & drop your image here</h3>
            <p className="text-gray-500 mb-6 text-sm">Supports JPG, PNG, WEBP (Max 10MB)</p>
            <button className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 transition-colors">
              Browse Files
            </button>
          </div>

          {/* Right Panel: Metadata Form */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="flex gap-2">
                <input type="text" placeholder="e.g. Yosemite National Park" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                <button className="bg-sky-50 text-sky-600 p-3 rounded-xl border border-sky-100 hover:bg-sky-100 transition-colors" title="Use GPS">
                  <MapPin size={20} />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <textarea placeholder="Any specific behaviors observed?" rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"></textarea>
            </div>

            <button 
              onClick={() => setUploadState('complete')}
              className="mt-auto bg-emerald-600 hover:bg-emerald-700 text-white w-full py-4 rounded-xl shadow-md shadow-emerald-200 font-bold transition-all text-lg"
            >
              Analyze & Identify
            </button>
          </div>
        </div>
      )}

      {/* Prediction Result State (Mockup) */}
      {uploadState === 'complete' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gray-100 min-h-[400px] relative">
            {/* Placeholder for uploaded image */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              [Uploaded Image Preview]
            </div>
          </div>
          <div className="p-8 md:w-1/2">
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold mb-4">
              98% Match
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-1">Blue Jay</h2>
            <p className="text-lg italic text-gray-500 mb-6">Cyanocitta cristata</p>
            
            <p className="text-gray-600 mb-6">
              A large, crested songbird with broad, rounded wings. Blue Jays are known for their intelligence and complex social systems with tight family bonds.
            </p>
            
            <div className="flex gap-4 mb-8">
              <button className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                <MapPin size={18} /> View on Map
              </button>
            </div>

            <button 
              onClick={() => setUploadState('idle')}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 py-3 rounded-xl font-medium transition-colors"
            >
              Upload Another Sighting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}