import React, { createContext, useContext, useState } from 'react';
import { apiFetch } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pw_user') || 'null');
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('pw_token') || '');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  
  // For artists: 'studio' (Creator Dashboard) or 'listener' (Standard Streaming)
  const [artistViewMode, setArtistViewMode] = useState(() => {
    return localStorage.getItem('audify_artist_view_mode') || 'studio';
  });

  const { showToast } = useToast();

  const isArtist = user?.role === 'artist';

  const setViewMode = (mode) => {
    setArtistViewMode(mode);
    localStorage.setItem('audify_artist_view_mode', mode);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (username, password) => {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (res.token && res.user) {
      localStorage.setItem('pw_token', res.token);
      localStorage.setItem('pw_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
      const isArt = res.user.role === 'artist';
      if (res.user.role === 'artist') {
        setArtistViewMode('studio');
        localStorage.setItem('audify_artist_view_mode', 'studio');
      }
      showToast(
        isArt
          ? `Welcome to Artist Studio, ${res.user.username}!`
          : `Welcome back, ${res.user.username}!`,
        'success'
      );
      return res;
    }
    throw new Error('Invalid login response');
  };

  const register = async (username, email, password, role = 'user') => {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role }),
    });

    if (res.token && res.user) {
      localStorage.setItem('pw_token', res.token);
      localStorage.setItem('pw_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
      if (role === 'artist' || res.user.role === 'artist') {
        setArtistViewMode('studio');
        localStorage.setItem('audify_artist_view_mode', 'studio');
      }
      showToast(
        role === 'artist'
          ? `Artist Studio account created! Welcome, ${res.user.username}.`
          : `Welcome to Audify, ${res.user.username}!`,
        'success'
      );
      return res;
    }

    showToast('Registration successful! Please sign in.', 'success');
    setAuthTab('login');
    return res;
  };

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {}
    localStorage.removeItem('pw_token');
    localStorage.removeItem('pw_user');
    setToken('');
    setUser(null);
    showToast('Signed out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isArtist,
        artistViewMode,
        setViewMode,
        isAuthModalOpen,
        authTab,
        setAuthTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
