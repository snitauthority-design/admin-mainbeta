'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Lock, LogOut } from 'lucide-react';

export default function AccountPage() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user.name || 'User'}!
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail size={20} />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center gap-3 text-gray-700">
                <User size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{user.phone}</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/wishlist"
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-primary transition-colors text-center"
          >
            <h3 className="font-semibold text-gray-900">Wishlist</h3>
            <p className="text-sm text-gray-600 mt-1">View saved items</p>
          </a>
          <a
            href="/cart"
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-primary transition-colors text-center"
          >
            <h3 className="font-semibold text-gray-900">Cart</h3>
            <p className="text-sm text-gray-600 mt-1">View shopping cart</p>
          </a>
          <a
            href="/track"
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-primary transition-colors text-center"
          >
            <h3 className="font-semibold text-gray-900">Track Order</h3>
            <p className="text-sm text-gray-600 mt-1">Check order status</p>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Login to Your Account
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo credentials: Any email and password will work</p>
        </div>
      </div>
    </div>
  );
}
