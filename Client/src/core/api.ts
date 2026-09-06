import { UserProfile, AppSettings } from '../types';

const API_URL = 'http://localhost:5000/api';

export const api = {
  // Authentication
  register: async (username: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.msg || 'Registration failed');
    }
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.msg || 'Login failed');
    }
    return res.json();
  },

  // Progress and Settings
  getUserData: async (token: string) => {
    const res = await fetch(`${API_URL}/progress`, {
      headers: { 'x-auth-token': token },
    });
    if (!res.ok) throw new Error('Failed to fetch user data');
    return res.json();
  },

  updateProfile: async (token: string, profileData: Partial<UserProfile>) => {
    const res = await fetch(`${API_URL}/progress/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  updateSettings: async (token: string, settingsData: Partial<AppSettings>) => {
    const res = await fetch(`${API_URL}/progress/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify(settingsData),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },
};
