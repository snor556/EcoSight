import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // MUST import Leaflet CSS!
import { Calendar, ChevronRight, Loader } from 'lucide-react';

// Create a custom modern map pin using standard HTML/CSS
const customMarkerIcon = new L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="background-color: #10b981; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
      <div style="background-color: white; width: 12px; height: 12px; border-radius: 50%;"></div>
    </div>
    <div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 12px solid #10b981; margin: -2px auto 0;"></div>
  `,
  iconSize: [36, 48],
  iconAnchor: [18, 48], // Point of the icon that corresponds to marker's location
  popupAnchor: [0, -48] // Point from which the popup should open relative to the iconAnchor
});

// A helper component to smoothly fly the map to the user's location
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);
  return null;
}
// Create a highly visible, custom modern cluster icon
const createCustomClusterIcon = (cluster) => {
  const count = cluster.getChildCount(); // Get how many pins are in this cluster

  return new L.divIcon({
    html: `
      <div style="
        background-color: rgba(16, 185, 129, 0.2); /* Emerald glow */
        width: 56px; height: 56px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
      ">
        <div style="
          background-color: #10b981; /* Emerald solid */
          color: white;
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900;
          font-size: 16px;
          border: 3px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        ">
          ${count}
        </div>
      </div>
    `,
    className: 'custom-cluster-icon', // Removes the ugly default leaflet cluster background
    iconSize: L.point(56, 56, true),
  });
};
export default function MapExplorer() {
  const [sightings, setSightings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([20.59, 78.96]); // Default center (India)

  const [radius, setRadius] = useState(50000);

  const loadNearbySightings = async (lat, lng, searchRadius) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
      
      const realSightings = response.data.data.map((sighting) => {
        return {
          id: sighting._id,
          // THE FIX: MongoDB sends [Long, Lat]. Leaflet needs [Lat, Long].
          position: [sighting.location.coordinates[1], sighting.location.coordinates[0]],
          species: sighting.species,
          confidence: sighting.confidence,
          date: new Date(sighting.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          image: sighting.imageUrl,
          description: sighting.description
        };
      });

      setSightings(realSightings);
    } catch (error) {
      console.error("Error fetching map data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapCenter([lat, lng]);
          loadNearbySightings(lat, lng, radius);
        },
        (error) => {
          console.log("Location access denied.");
          loadNearbySightings(mapCenter[0], mapCenter[1],radius);
        }
      );
    } else {
      loadNearbySightings(mapCenter[0], mapCenter[1],radius);
    }
  }, []);

  useEffect(() => {
    loadNearbySightings(mapCenter[0], mapCenter[1], radius);
  }, [radius]);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden rounded-3xl border border-gray-200 shadow-sm animate-in fade-in duration-500 font-sans z-0">
      
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-[1000]">
          <Loader className="animate-spin text-emerald-600 mb-4" size={48} />
          <p className="text-gray-600 font-bold">Scanning area for wildlife...</p>
        </div>
      )}

      {/* NEW 3: The Floating Radius Control Panel */}
      <div className="absolute top-4 right-4 z-[1000] bg-white p-3 rounded-2xl shadow-lg border border-gray-100 backdrop-blur-md bg-white/90">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Search Radius</label>
        <select
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <option value={10000}>10 Kilometers</option>
          <option value={50000}>50 Kilometers</option>
          <option value={200000}>200 Kilometers</option>
          <option value={500000}>500 Kilometers</option>
          <option value={5000000}>Global View</option>
        </select>
      </div>

      {/* THE REAL LEAFLET MAP */}
      <MapContainer 
        center={mapCenter} 
        zoom={5} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false} // Hiding default controls for a cleaner look
      >
        <MapRecenter center={mapCenter} />
        
        {/* OpenStreetMap Tiles (Free!) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* NEW 4: Visual Feedback! Draws a translucent boundary circle on the map */}
        <Circle 
          center={mapCenter} 
          radius={radius} 
          pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.1, weight: 2 }} 
        />

        {/* Plotting our real MongoDB data inside a Cluster Group! */}
        <MarkerClusterGroup
          chunkedLoading // Helps performance if you have thousands of markers
          maxClusterRadius={50} // The pixel radius to group markers together
          iconCreateFunction={createCustomClusterIcon}
        >
          {sightings.map(sighting => (
            <Marker 
              key={sighting.id} 
              position={sighting.position} 
              icon={customMarkerIcon}
            >
              <Popup className="custom-popup" closeButton={false}>
                <div className="w-64 -m-3 overflow-hidden rounded-xl">
                  <div className="relative h-32">
                    <img src={sighting.image} alt={sighting.species} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                      {sighting.confidence}% Match
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 capitalize !m-0">{sighting.species}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <Calendar size={12} /> {sighting.date}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-3 !m-0 mb-3 leading-relaxed">
                      {sighting.description}
                    </p>
                    <button className="w-full flex justify-between items-center text-emerald-600 font-bold text-xs group">
                      View Details 
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}