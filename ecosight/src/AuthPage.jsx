import React, { useState } from 'react';
import axios from 'axios'; // NEW: Import Axios
import { Leaf, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // NEW: State variables to track what the user types
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // NEW: State for showing errors and loading status
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // NEW: The Integration Engine
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from refreshing
    setError('');
    setIsLoading(true);

    try {
      let response;
      
      if (isLogin) {
        // NOTE: We will build this backend route next!
        response = await axios.post('http://localhost:3000/api/auth/login', {
          email,
          password
        });
      } else {
        // Calling the Registration route we just built!
        response = await axios.post('http://localhost:3000/api/auth/register', {
          username: name,
          email: email,
          password: password
        });
      }

      // Success! The server gave us the VIP wristband (JWT)
      const { token, user } = response.data;

      // Save the token to the browser's permanent vault
      localStorage.setItem('ecoSightToken', token);
      
      // Save basic user info so we can display their name in the app
      localStorage.setItem('ecoSightUser', JSON.stringify(user));

      // Tell the main App.jsx that we are officially logged in!
      onLogin(); 

    } catch (err) {
      // If the backend sends an error (like "User already exists"), display it!
      setError(err.response?.data?.message || 'An error occurred. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left Panel (Remains unchanged) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80" 
          alt="Misty forest" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/20 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full">
          <div className="flex items-center gap-3 mb-8">
            <Leaf size={32} className="text-emerald-400" />
            <span className="text-3xl font-bold tracking-tight">EcoSight</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">Join the global network of nature explorers.</h2>
          <p className="text-emerald-100 text-lg max-w-md">Identify species, track your sightings, and contribute to biodiversity research—all in one place.</p>
        </div>
      </div>

      {/* Right Panel: Login / Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="max-w-md w-full">
          <div className="flex lg:hidden items-center gap-3 text-emerald-700 mb-10 justify-center">
            <Leaf size={32} className="fill-emerald-600" />
            <span className="text-3xl font-bold tracking-tight">EcoSight</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-gray-500">
              {isLogin ? 'Enter your details to access your dashboard.' : 'Start identifying and mapping wildlife today.'}
            </p>
          </div>

          {/* NEW: Error Display Box */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3 animate-in fade-in">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* NEW: Replaced the dummy onSubmit with our real handleSubmit */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    required // HTML validation
                    value={name} // Binding to state
                    onChange={(e) => setName(e.target.value)} // Updating state
                    placeholder="NatureLover99" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')} 
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Social Logins and Toggle removed for brevity, keep your exact code here! */}
          <div className="mt-10 text-center">
            <p className="text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(''); // Clear errors when switching modes
                }} 
                className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}