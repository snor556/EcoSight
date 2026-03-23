import React, { useState } from 'react';
import { Leaf, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex font-sans bg-white">
      
      {/* Left Panel: Nature Themed Image (Hidden on Mobile) */}
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
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Join the global network of nature explorers.
          </h2>
          <p className="text-emerald-100 text-lg max-w-md">
            Identify species, track your sightings, and contribute to biodiversity research—all in one place.
          </p>
        </div>
      </div>

      {/* Right Panel: Login / Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="max-w-md w-full">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="flex lg:hidden items-center gap-3 text-emerald-700 mb-10 justify-center">
            <Leaf size={32} className="fill-emerald-600" />
            <span className="text-3xl font-bold tracking-tight">EcoSight</span>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-gray-500">
              {isLogin 
                ? 'Enter your details to access your dashboard.' 
                : 'Start identifying and mapping wildlife today.'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            
            {/* Name Field (Only for Signup) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Jane Doe" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                {isLogin && <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Forgot password?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isLogin ? 'Log In' : 'Create Account'} <ArrowRight size={18} />
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-sm text-gray-400 font-medium">OR CONTINUE WITH</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 py-3 rounded-xl font-medium text-gray-700 transition-all shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 py-3 rounded-xl font-medium text-gray-700 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.34-.85 3.73-.78 1.07.05 2.6.43 3.5 1.74-2.71 1.68-2.14 5.31.7 6.46-1.12 2.23-2.01 3.82-3.01 4.75M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25"/></svg>
              Apple
            </button>
          </div>

          {/* Toggle Login/Signup */}
          <div className="mt-10 text-center">
            <p className="text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
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