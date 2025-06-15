import React, { createContext, useContext, useState } from 'react';

interface Skill {
  name: string;
  value: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  joinDate: string;
  timezone: string;
  streak: number;
  skills: Skill[];
}

interface UserContextType {
  user: User;
  updateUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    level: 12,
    joinDate: '2024-03-15',
    timezone: 'UTC-5 (Eastern Time)',
    streak: 27,
    skills: [
      { name: 'Algorithms', value: 85 },
      { name: 'Data Structures', value: 78 },
      { name: 'System Design', value: 60 },
      { name: 'Database', value: 72 },
      { name: 'Frontend', value: 65 },
      { name: 'Backend', value: 70 },
    ],
  });

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};