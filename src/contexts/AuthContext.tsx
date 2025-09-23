import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Decide whether to use mock auth (preview/prod) or real backend (local dev)
const useMockAuth = () => {
  const mode = localStorage.getItem('authMode'); // 'mock' | 'real' | null
  if (mode === 'mock') return true;
  if (mode === 'real') return false;
  // Default to mock so local VS Code runs work without backend
  return true;
};

// Mock users for development - stored in localStorage for persistence
const getMockUsers = (): Map<string, { id: string; username: string; email: string; password: string }> => {
  const stored = localStorage.getItem('mockUsers');
  if (stored) {
    try {
      const userData = JSON.parse(stored);
      return new Map(Object.entries(userData));
    } catch {
      return new Map();
    }
  }
  return new Map();
};

const saveMockUsers = (users: Map<string, { id: string; username: string; email: string; password: string }>) => {
  const userData = Object.fromEntries(users);
  localStorage.setItem('mockUsers', JSON.stringify(userData));
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      if (useMockAuth()) {
        // Mock token verification for development
        try {
          const userData = JSON.parse(atob(token));
          setUser(userData);
        } catch {
          localStorage.removeItem('authToken');
        }
        setIsLoading(false);
      } else {
        // Real backend token verification
        fetch('http://localhost:3001/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
          if (data.user) setUser(data.user);
        })
        .catch(() => localStorage.removeItem('authToken'))
        .finally(() => setIsLoading(false));
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (useMockAuth()) {
      // Mock login for development
      console.info('[Auth] Using mock login');
      const mockUsers = getMockUsers();
      const mockUser = mockUsers.get(email);
      if (mockUser && mockUser.password === password) {
        const userData = { id: mockUser.id, username: mockUser.username, email: mockUser.email };
        const token = btoa(JSON.stringify(userData));
        localStorage.setItem('authToken', token);
        setUser(userData);
        return true;
      }
      return false;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    if (useMockAuth()) {
      // Mock registration for development (idempotent)
      const mockUsers = getMockUsers();
      const existing = mockUsers.get(email);
      const userData = existing ?? {
        id: Date.now().toString(),
        username,
        email,
        password
      };
      // Update stored user with latest credentials/username
      userData.username = username;
      userData.password = password;
      
      mockUsers.set(email, userData);
      saveMockUsers(mockUsers);
      const userResponse = { id: userData.id, username: userData.username, email: userData.email };
      const token = btoa(JSON.stringify(userResponse));
      localStorage.setItem('authToken', token);
      setUser(userResponse);
      return true;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}