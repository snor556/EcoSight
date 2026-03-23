
import React, { useState, useEffect } from 'react';
import { 
  Leaf, Camera, Sparkles, Map, ArrowRight, ShieldCheck, MapPin, 
  CheckCircle2, ChevronLeft, ChevronRight, UploadCloud, Cpu, Globe 
} from 'lucide-react';

const CAROUSEL_DATA = [
  {
    image: "https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=1000&q=80",
    species: "Scarlet Macaw",
    location: "Costa Rica"
  },
  {
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1000&q=80",
    species: "Red Fox",
    location: "North America"
  },
  {
    image: "https://images.unsplash.com/photo-1550159930-40066082a4fc?auto=format&fit=crop&w=1000&q=80",
    species: "Red-eyed Tree Frog",
    location: "Panama"
  }
];

export default function HomePage({ onGetStarted }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play effect for the carousel (switches every 3 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_DATA.length);
    }, 3000);
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  // Manual switch functions
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_DATA.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? CAROUSEL_DATA.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-green-50/30 font-sans text-gray-800">
      
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3 text-emerald-700">
          <Leaf size={32} className="fill-emerald-600" />
          <span className="text-3xl font-bold tracking-tight">EcoSight</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-gray-600">
          <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How it Works</a>
          <a href="#community" className="hover:text-emerald-600 transition-colors">Community</a>
        </div>
        <div className="flex gap-4">
          <button className="hidden md:block px-5 py-2.5 text-emerald-700 font-medium hover:bg-emerald-50 rounded-xl transition-colors">
            Log In
          </button>
          <button 
            onClick={onGetStarted}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
          >
            Get Started <ArrowRight size={18} />
          </button>
        </div>
      </nav>

      {/* Split-Layout Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-12 pb-24 md:pt-20 md:pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="text-left">
            <div className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold mb-6 tracking-wide uppercase">
              Meet Your AI Nature Guide
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Discover the wildlife hidden in plain sight.
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed max-w-lg">
              Join a community of nature enthusiasts. Upload photos of birds and animals, let our AI identify the species, and map your sightings across the globe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onGetStarted}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2"
              >
                <Camera size={22} /> Identify a Species
              </button>
              <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-2xl text-lg font-bold shadow-sm transition-all flex items-center justify-center gap-2">
                <Map size={22} /> Explore Map
              </button>
            </div>
          </div>

          {/* Right Image Carousel Content */}
          <div className="relative mt-10 md:mt-0 group">
            
            {/* Main Carousel Image Container */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-900/10 border-4 border-white aspect-[4/5] md:aspect-square bg-gray-100">
              {CAROUSEL_DATA.map((slide, index) => (
                <img 
                  key={index}
                  src={slide.image} 
                  alt={slide.species}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {/* Carousel Manual Controls */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white backdrop-blur-md text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white backdrop-blur-md text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
              >
                <ChevronRight size={24} />
              </button>

               {/* Carousel Dots */}
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {CAROUSEL_DATA.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Observation Badge (Dynamic based on current slide) */}
            <div className="absolute -bottom-6 -left-6 md:-left-12 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce-slow z-10 transition-transform">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} className="text-emerald-600" />
              </div>
              <div className="min-w-[140px]">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Species Identified</p>
                <p className="text-sm font-bold text-gray-900 truncate">{CAROUSEL_DATA[currentSlide].species}</p>
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
                  <MapPin size={12} /> {CAROUSEL_DATA[currentSlide].location}
                </div>
              </div>
            </div>
            
            {/* Decorative background shape */}
            <div className="absolute -inset-4 bg-emerald-100 rounded-[2.5rem] -z-10 rotate-3 scale-105 opacity-50"></div>
          </div>
        </div>
      </header>

      {/* --- NEW: How It Works Section --- */}
      <section id="how-it-works" className="bg-emerald-50/50 py-24 border-y border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How EcoSight Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">From capturing a photo to contributing to global wildlife data in three simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200 z-0"></div>

            <StepCard 
              number="1"
              icon={<UploadCloud size={28} className="text-emerald-600" />}
              title="Upload a Sighting"
              description="Snap a photo of a bird, mammal, or insect out in the wild. Upload it directly from your phone or computer."
            />
            <StepCard 
              number="2"
              icon={<Cpu size={28} className="text-emerald-600" />}
              title="AI Analysis"
              description="Our computer vision model scans the image to identify the exact species, providing you with detailed scientific insights."
            />
            <StepCard 
              number="3"
              icon={<Globe size={28} className="text-emerald-600" />}
              title="Map & Contribute"
              description="Your sighting is pinned to our interactive map, helping researchers track biodiversity and migration patterns."
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-white py-24 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to explore nature</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Designed for bird watchers, photographers, and curious minds. No technical expertise required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Sparkles className="text-amber-500" size={32} />}
              bg="bg-amber-50"
              title="Instant AI Identification"
              description="Upload any photo and our advanced AI will instantly identify the species, providing detailed scientific and habitat information."
            />
            <FeatureCard 
              icon={<Map className="text-sky-500" size={32} />}
              bg="bg-sky-50"
              title="Interactive Mapping"
              description="View your sightings and explore dense clusters of wildlife activity around the world on our interactive geo-tagged map."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-emerald-500" size={32} />}
              bg="bg-emerald-50"
              title="Conservation Focus"
              description="Learn about the conservation status of different species and contribute to a global database of biodiversity."
            />
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="bg-emerald-900 rounded-3xl p-12 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to start exploring?</h2>
            <p className="text-emerald-100 mb-10 text-lg max-w-xl mx-auto">
              Create your free account today to build your personal species library and join thousands of other wildlife enthusiasts.
            </p>
            <button 
              onClick={onGetStarted}
              className="bg-white text-emerald-900 hover:bg-emerald-50 px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all"
            >
              Create Free Account
            </button>
          </div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-700 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-50"></div>
        </div>
        
        <div className="mt-12 text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 EcoSight. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-component for the "How it Works" Steps
function StepCard({ number, icon, title, description }) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-emerald-50 flex items-center justify-center mb-6 relative">
        {icon}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 text-white font-bold rounded-full flex items-center justify-center shadow-md border-2 border-white">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

// Sub-component for Features
function FeatureCard({ icon, title, description, bg }) {
  return (
    <div className="p-8 rounded-3xl border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition-all bg-white group cursor-pointer">
      <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}