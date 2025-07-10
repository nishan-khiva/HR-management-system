import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'HR Manager',
    email: 'hr.manager@company.com',
    position: 'Human Resource Manager',
    department: 'Human Resource',
    profile: 'https://randomuser.me/api/portraits/women/44.jpg', // HR manager profile image
    role: 'HR'
  });

  const login = (userData) => {
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 