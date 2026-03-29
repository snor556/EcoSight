import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Leaf, Search, Bell, User, UploadCloud, Map as MapIcon, 
  MapPin, CheckCircle2, AlertTriangle, Settings, Calendar,
  Grid, List, ChevronRight, Mail, MessageSquare, X
} from 'lucide-react';
import MapExplorer from './MapExplorer';
import CommunityView from './CommunityView';

export default function EcoSightApp({ onLogout }) {
  // We only need activeTab here now!
  const [activeTab, setActiveTab] = useState('profile'); 

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
        {activeTab === 'upload' && <UploadView />} 
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
// Dynamic Profile View (Dashboard + Library)
// -----------------------------------------------------------------
function ProfileView() {
  const userString = localStorage.getItem('ecoSightUser');
  const currentUser = userString ? JSON.parse(userString) : { username: 'Explorer', email: '' };
  const [profileTab, setProfileTab] = useState('library');
  const [sightings, setSightings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userData, setUserData] = useState(currentUser); // Track the user data locally so it updates instantly
  
  // The Memory! Keeps track of which image is currently clicked
  const [selectedSighting, setSelectedSighting] = useState(null);

  //const avatarLetter = currentUser.username.charAt(0).toUpperCase();
  const avatarLetter = userData?.username?.charAt(0).toUpperCase() || 'E';
  useEffect(() => {
    const fetchUserSightings = async () => {
      try {
        const token = localStorage.getItem('ecoSightToken');
        const response = await axios.get('http://localhost:3000/api/sightings/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSightings(response.data.data);
      } catch (err) {
        console.error("Failed to fetch sightings", err);
        setError("Could not load your sightings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSightings();
  }, []);

  const totalSightings = sightings.length;
  const identifiedSightings = sightings.filter(s => !s.title && s.species !== "Unknown / Pending");
  const uniqueSpeciesCount = new Set(sightings.map(s => s.species)).size;

  if (isLoading) return <div className="p-10 text-center text-gray-500 animate-pulse">Loading your nature journal...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Profile Header & Settings */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-4xl border-4 border-white shadow-md uppercase">
            {avatarLetter}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 capitalize">{currentUser.username}</h1>
            <p className="text-gray-500 flex items-center gap-2">
              <Mail size={16} /> {currentUser.email}
            </p>
          </div>
        </div>
       <button 
    onClick={() => setIsEditingProfile(true)} 
    className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2"
  >
    <Settings size={18} /> Edit Profile
  </button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>}

      {/* Dynamic Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Sightings" value={totalSightings} icon={<MapPin className="text-sky-500"/>} bg="bg-sky-50" />
        <StatCard title="Species Identified" value={uniqueSpeciesCount} icon={<CheckCircle2 className="text-emerald-500"/>} bg="bg-emerald-50" />
        <StatCard title="Rare Discoveries" value="0" icon={<AlertTriangle className="text-amber-500"/>} bg="bg-amber-50" />
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
          {profileTab === 'library' 
            ? <SpeciesLibraryTab sightings={sightings} uniqueCount={uniqueSpeciesCount} onSightingClick={setSelectedSighting} /> 
            : <RecentSightingsTab sightings={sightings} onSightingClick={setSelectedSighting} />
          }
        </div>
      </div>

      {/* The Pop-up Modal */}
      <SightingModal 
        sighting={selectedSighting} 
        onClose={() => setSelectedSighting(null)} 
      />
      {isEditingProfile && (
    <EditProfileModal 
      currentUser={userData} 
      onClose={() => setIsEditingProfile(false)}
      onUpdate={(updatedData) => setUserData(updatedData)} // This updates the UI instantly!
    />
  )}
    </div>
  );
}

// -----------------------------------------------------------------
// Dynamic Species Library
// -----------------------------------------------------------------
function SpeciesLibraryTab({ sightings, uniqueCount, onSightingClick }) {
  const uniqueSpecies = [];
  const seenSpecies = new Set();
  
  sightings.forEach(sighting => {
    if (sighting.title || sighting.species === "Unknown / Pending") return;
    const speciesName = sighting.species ? sighting.species.toLowerCase() : 'unknown';
    if (!seenSpecies.has(speciesName)) {
      seenSpecies.add(speciesName);
      uniqueSpecies.push(sighting);
    }
  });

  if (uniqueSpecies.length === 0) {
    return <div className="text-center py-10 text-gray-500">You haven't identified any species yet. Head over to the Upload tab to get started!</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">You have successfully identified {uniqueCount} distinct species.</p>
        <div className="flex gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
          <button className="p-1.5 bg-white shadow-sm rounded-md text-emerald-700"><Grid size={18}/></button>
          <button className="p-1.5 text-gray-400 hover:text-gray-700"><List size={18}/></button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {uniqueSpecies.map((item, idx) => (
          <div 
            key={item._id || idx} 
            className="group cursor-pointer" 
            onClick={() => onSightingClick(item)}
          >
            <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-100 shadow-sm">
              <img src={item.imageUrl} alt={item.species} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="font-bold text-gray-900 capitalize group-hover:text-emerald-600 transition-colors">{item.species}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// Dynamic Recent Sightings
// -----------------------------------------------------------------
function RecentSightingsTab({ sightings, onSightingClick }) {
  if (sightings.length === 0) {
    return <div className="text-center py-10 text-gray-500">No recent sightings found.</div>;
  }

  return (
    <div className="space-y-4">
      {sightings.slice(0).reverse().map((item, idx) => (
        <div 
          key={item._id || idx} 
          onClick={() => onSightingClick(item)} 
          className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0">
               <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.species}/>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg capitalize">{item.species}</h4>
              <p className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> 
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
                </span>
              </p>
            </div>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
        </div>
      ))}
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
// Upload View
// -----------------------------------------------------------------
// -----------------------------------------------------------------
// Upload View (Now with Forward Geocoding!)
// -----------------------------------------------------------------
function UploadView() {
  const [uploadState, setUploadState] = useState('idle');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [resultData, setResultData] = useState(null); 

  // NEW: Geocoding State Variables
  const [locationQuery, setLocationQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); 
    }
  };

  // EXISTING: HTML5 Geolocation
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

  // NEW: Forward Geocoding API Call
  const handleLocationSearch = async () => {
    if (!locationQuery.trim()) return;
    
    setIsSearchingLocation(true);
    try {
      // Hit the free OpenStreetMap API
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`);
      
      if (response.data && response.data.length > 0) {
        // The API returns strings, so we parse them to decimals
        setLatitude(parseFloat(response.data[0].lat));
        setLongitude(parseFloat(response.data[0].lon));
      } else {
        alert("We couldn't find that location. Try being more specific (e.g., 'Central Park, New York').");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Failed to search for location. Please try again.");
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleUpload = async () => {
    if (!file || latitude === '' || longitude === '') {
      alert("Please select an image and set your location first!");
      return;
    }

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    try {
      const token = localStorage.getItem('ecoSightToken');
      const response = await axios.post("http://localhost:3000/api/sighting", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
      });
      
      setResultData(response.data.data); 
      setUploadState('complete');
      
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to analyze image. Is your backend running and are you logged in?");
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreviewUrl(null);
    setResultData(null);
    setUploadState('idle');
    setLatitude('');
    setLongitude('');
    setLocationQuery('');
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Identify a Species</h1>
      <p className="text-gray-500 mb-8">Upload an image and let our AI assist you with identification.</p>

      {uploadState === 'idle' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* IMAGE UPLOAD BOX */}
          <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/30 rounded-3xl p-12 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]">
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
            
            {/* NEW: Multi-method Location Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Location (Required)</label>
              
              {/* Method 1: Text Search */}
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                  placeholder="Search area (e.g., Yosemite)" 
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
                <button 
                  type="button" 
                  onClick={handleLocationSearch}
                  disabled={isSearchingLocation || !locationQuery.trim()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {isSearchingLocation ? '...' : 'Search'}
                </button>
              </div>

              {/* Method 2: Auto GPS */}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly
                  value={latitude !== '' ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : ""}
                  placeholder="Or click the GPS button ->" 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none text-sm" 
                />
                <button 
                  type="button"
                  onClick={getLocation} 
                  className="bg-sky-50 text-sky-600 p-3 rounded-xl border border-sky-100 hover:bg-sky-100 transition-colors" 
                  title="Use Device GPS"
                >
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
            <img src={resultData.imageUrl} alt={resultData.species} className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="p-8 md:w-1/2">
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold mb-4">
              {resultData.confidence}% AI Match
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-1 capitalize">{resultData.species}</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed mt-4">
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
// -----------------------------------------------------------------
// Sighting Detail Modal
// -----------------------------------------------------------------
function SightingModal({ sighting, onClose }) {
  if (!sighting) return null;

  // Extract the coordinates securely from the GeoJSON format we built in the backend
  const lng = sighting.location?.coordinates?.[0] || 0;
  const lat = sighting.location?.coordinates?.[1] || 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* The Modal Card */}
      <div className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col md:flex-row relative max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Side: The Large Image */}
        <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 relative shrink-0">
          <img src={sighting.imageUrl} alt={sighting.species} className="absolute inset-0 w-full h-full object-cover" />
        </div>

        {/* Right Side: The Data */}
        <div className="p-8 md:w-1/2 flex flex-col overflow-y-auto">
          <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-3 w-max">
            {sighting.confidence ? `${sighting.confidence}% AI Match` : 'Verified Sighting'}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 capitalize">{sighting.species}</h2>

          <div className="flex flex-col gap-3 mt-4 text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="flex items-center gap-2 font-medium">
              <Calendar size={18} className="text-emerald-600"/>
              {new Date(sighting.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="flex items-center gap-2 font-medium">
              <MapPin size={18} className="text-sky-500"/>
              GPS: {lat.toFixed(4)}, {lng.toFixed(4)}
            </p>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2 text-lg">About this species</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {sighting.description || "No specific information was found for this species at the time of upload."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
// -----------------------------------------------------------------
// UI: Edit Profile Modal
// -----------------------------------------------------------------
function EditProfileModal({ currentUser, onClose, onUpdate }) {
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('ecoSightToken');
      // Adjust this URL to match wherever you put your backend route!
      const response = await axios.put('http://localhost:3000/api/users/profile', 
        { username, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the browser's vault with the new data
      localStorage.setItem('ecoSightUser', JSON.stringify(response.data.data));
      
      // Tell the parent component to refresh the UI
      onUpdate(response.data.data);
      onClose();
    } catch (err) {
      console.error("Failed to update profile", err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors">
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
          
          {error && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                required 
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-xl font-bold transition-all">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}