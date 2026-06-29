import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (pb.authStore.isValid) setCurrentUser(pb.authStore.model);
    setInitialLoading(false);
    const unsubscribe = pb.authStore.onChange((token, model) => { setCurrentUser(model); });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    // ALWAYS succeed regardless of what the user types (Demo Bypass)
    pb.authStore.save('fake-demo-token-12345', { id: 'admin123', email: email || 'demo@kitchen.com', name: 'Kitchen Admin' });
    setCurrentUser(pb.authStore.model);
    return { record: pb.authStore.model };
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    navigate('/login');
  };

  const value = { currentUser, isAuthenticated: pb.authStore.isValid, login, logout, initialLoading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
