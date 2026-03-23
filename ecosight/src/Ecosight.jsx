import React, { useState } from 'react';
import axios from 'axios';
import { 
  Leaf, Search, Bell, User, UploadCloud, Map as MapIcon, 
  MapPin, CheckCircle2, AlertTriangle, Settings, Calendar,
  Grid, List, ChevronRight
} from 'lucide-react';
import MapExplorer from './MapExplorer';
import { MessageSquare } from 'lucide-react';
import CommunityView from './CommunityView';

export default function EcoSightApp({ onLogout }) {
  // Defaulting to profile since it's now the main hub
  const [activeTab, setActiveTab] = useState('profile'); 
  const [uploadState, setUploadState] = useState('idle');

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-gray-800 relative">
      
      {/* Top Navigation Bar */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 text-emerald-700 w-1/4">
            <Leaf size={28} className="fill-emerald-600" />
            <span className="text-2xl font-bold tracking-tight hidden sm:block">EcoSight</span>
          </div>

          {/* Center Navigation Links */}
          <nav className="flex items-center gap-2 md:gap-6 w-2/4 justify-center">
            <NavButton 
              active={activeTab === 'community'} 
              onClick={() => setActiveTab('community')} 
              icon={<MessageSquare size={20} />} 
              label="Community" 
            />
            <NavButton 
              active={activeTab === 'upload'} 
              onClick={() => setActiveTab('upload')} 
              icon={<UploadCloud size={20} />} 
              label="Upload" 
            />
            <NavButton 
              active={activeTab === 'map'} 
              onClick={() => setActiveTab('map')} 
              icon={<MapIcon size={20} />} 
              label="Map Explorer" 
            />
            <NavButton 
              active={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')} 
              icon={<User size={20} />} 
              label="My Profile" 
            />
          </nav>

          {/* Right Side: Search & Actions */}
          <div className="flex items-center justify-end gap-4 w-1/4 ml-auto">
            <div className="relative hidden lg:block w-48 xl:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <button className="p-2 text-gray-500 hover:text-emerald-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>
            <button onClick={onLogout} className="text-sm font-medium text-gray-500 hover:text-gray-900 hidden sm:block ml-2">
              Log out
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'upload' && <UploadView uploadState={uploadState} setUploadState={setUploadState} />}
       {activeTab === 'map' && <MapExplorer />}
       {activeTab === 'community' && <CommunityView />}
      </main>
    </div>
  );
}

/* --- Sub-components --- */

function NavButton({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
        active 
        ? 'bg-emerald-50 text-emerald-700 font-bold' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-emerald-600 font-medium'
      }`}
    >
      {icon}
      <span className="hidden md:block">{label}</span>
    </button>
  );
}

// -----------------------------------------------------------------
// NEW: Combined Profile View (Dashboard + Library)
// -----------------------------------------------------------------
function ProfileView() {
  const [profileTab, setProfileTab] = useState('library'); // 'library' or 'sightings'

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Profile Header & Settings */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-3xl border-4 border-white shadow-md">
            AM
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Alex Morgan</h1>
            <p className="text-gray-500 flex items-center gap-2">
              <MapPin size={16} /> Pacific Northwest, USA • Member since 2024
            </p>
          </div>
        </div>
        <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2">
          <Settings size={18} /> Edit Profile
        </button>
      </div>

      {/* Dashboard Stats (Moved from old Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Sightings" value="142" icon={<MapPin className="text-sky-500"/>} bg="bg-sky-50" />
        <StatCard title="Species Identified" value="48" icon={<CheckCircle2 className="text-emerald-500"/>} bg="bg-emerald-50" />
        <StatCard title="Rare Discoveries" value="3" icon={<AlertTriangle className="text-amber-500"/>} bg="bg-amber-50" />
      </div>

      {/* Profile Content Tabs */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 flex gap-8 px-8 pt-6">
          <button 
            onClick={() => setProfileTab('library')}
            className={`pb-4 font-bold text-lg transition-colors relative ${profileTab === 'library' ? 'text-emerald-700' : 'text-gray-400 hover:text-gray-700'}`}
          >
            My Species Library
            {profileTab === 'library' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setProfileTab('sightings')}
            className={`pb-4 font-bold text-lg transition-colors relative ${profileTab === 'sightings' ? 'text-emerald-700' : 'text-gray-400 hover:text-gray-700'}`}
          >
            Recent Sightings
            {profileTab === 'sightings' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full"></div>}
          </button>
        </div>

        <div className="p-8">
          {profileTab === 'library' ? <SpeciesLibraryTab /> : <RecentSightingsTab />}
        </div>
      </div>

    </div>
  );
}

function SpeciesLibraryTab() {
  const library = [
    { name: "Blue Jay", scientific: "Cyanocitta cristata", category: "Bird", image: "https://images.unsplash.com/photo-1552728089-5716928236bd?auto=format&fit=crop&w=300&q=80" },
    { name: "Red Fox", scientific: "Vulpes vulpes", category: "Mammal", image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=300&q=80" },
    { name: "Monarch Butterfly", scientific: "Danaus plexippus", category: "Insect", image: "https://images.unsplash.com/photo-1541426062085-78097d7ee46a?auto=format&fit=crop&w=300&q=80" },
    { name: "Scarlet Macaw", scientific: "Ara macao", category: "Bird", image: "https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=300&q=80" }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">You have successfully identified 48 distinct species.</p>
        <div className="flex gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
          <button className="p-1.5 bg-white shadow-sm rounded-md text-emerald-700"><Grid size={18}/></button>
          <button className="p-1.5 text-gray-400 hover:text-gray-700"><List size={18}/></button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {library.map((item, idx) => (
          <div key={idx} className="group cursor-pointer">
            <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-100">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="font-bold text-gray-900">{item.name}</h3>
            <p className="text-xs text-gray-500 italic">{item.scientific}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentSightingsTab() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0">
               <img src="https://images.unsplash.com/photo-1552728089-5716928236bd?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" alt="Sighting"/>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Blue Jay</h4>
              <p className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1"><MapPin size={14} /> Yosemite National Park</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> Oct 24, 2025</span>
              </p>
            </div>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
        </div>
      ))}
      <button className="w-full py-4 text-emerald-600 font-bold hover:bg-emerald-50 rounded-xl transition-colors mt-4">
        View All 142 Sightings
      </button>
    </div>
  );
}

function StatCard({ title, value, icon, bg }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-xl ${bg}`}>
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// Upload View (Unchanged mostly, just contained inside main)
// -----------------------------------------------------------------
function UploadView({ uploadState, setUploadState }) {
  // 1. New State Variables to hold our real data
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // To show the image before uploading
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [resultData, setResultData] = useState(null); // Holds the backend response

  // 2. Handle File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Show local preview
    }
  };

  // 3. Get Real GPS Coordinates from the Browser
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      }, (error) => {
        alert("Please allow location access to tag your sighting!");
      });
    }
  };

  // 4. The Integration Hero Function!
  const handleUpload = async () => {
    if (!file || !latitude || !longitude) {
      alert("Please select an image and get your GPS location first!");
      return;
    }

    setIsUploading(true);
    
    // Create the exact Form-Data structure Postman used
    const formData = new FormData();
    formData.append("file", file);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    try {
      // Send to your Node.js backend! 
      // (Make sure your backend app.use(cors()) is enabled!)
      const response = await axios.post("http://localhost:3000/api/sighting", formData);
      
      // Save the real Cloudinary URL, Wikipedia text, and species name
      setResultData(response.data.data); 
      setUploadState('complete');
      
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to analyze image. Is your backend running?");
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreviewUrl(null);
    setResultData(null);
    setUploadState('idle');
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Identify a Species</h1>
      <p className="text-gray-500 mb-8">Upload an image and let our AI assist you with identification.</p>

      {uploadState === 'idle' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* IMAGE UPLOAD BOX */}
          <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/30 rounded-3xl p-12 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]">
            
            {/* The invisible file input */}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            />
            
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-3xl" />
            ) : (
              <>
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <UploadCloud size={32} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Click or drag image here</h3>
                <p className="text-gray-500 mb-6 text-sm">Supports JPG, PNG (Max 10MB)</p>
                <button className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium shadow-sm pointer-events-none">
                  Browse Files
                </button>
              </>
            )}
          </div>

          {/* METADATA FORM */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location (Required)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly
                  value={latitude ? `${latitude}, ${longitude}` : ""}
                  placeholder="Click the GPS button ->" 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none" 
                />
                <button onClick={getLocation} className="bg-sky-50 text-sky-600 p-3 rounded-xl border border-sky-100 hover:bg-sky-100 transition-colors" title="Use GPS">
                  <MapPin size={20} />
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleUpload}
              disabled={isUploading}
              className={`mt-auto w-full py-4 rounded-xl shadow-md font-bold transition-all text-lg ${
                isUploading ? 'bg-gray-400 text-gray-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
              }`}
            >
              {isUploading ? 'Analyzing Image...' : 'Analyze & Identify'}
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS RESULTS SCREEN */}
      {uploadState === 'complete' && resultData && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row animate-in slide-in-from-bottom-4">
          <div className="md:w-1/2 bg-gray-100 min-h-[400px] relative">
             {/* Showing the real Cloudinary Image! */}
            <img src={resultData.imageUrl} alt={resultData.species} className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="p-8 md:w-1/2">
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold mb-4">
              {resultData.confidence}% AI Match
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-1 capitalize">{resultData.species}</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed mt-4">
              {/* Showing the real Wikipedia Summary! */}
              {resultData.description}
            </p>
            
            <button 
              onClick={resetUpload}
              className="mt-8 w-full bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 py-3 rounded-xl font-medium transition-colors"
            >
              Upload Another Sighting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}