
"use client";

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

export type Role = 'field_engineer' | 'manager' | 'user';

type UserRoleContextType = {
  role: Role;
  setRole: Dispatch<SetStateAction<Role>>;
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [role, setRole] = useState<Role>('user'); 
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    setIsClient(true);
    try {
      const savedRole = localStorage.getItem('userRole') as Role;
      if (savedRole) {
        setRole(savedRole);
      }
      const savedUserName = localStorage.getItem('userName');
      if (savedUserName) {
        setUserName(savedUserName);
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
          localStorage.setItem('userRole', role);
          localStorage.setItem('userName', userName);
      } catch (error) {
          console.error("Failed to save to localStorage", error);
      }
    }
  }, [role, userName, isClient]);
  
  const value = {
    role,
    setRole,
    userName,
    setUserName
  };

  return (
    <UserRoleContext.Provider value={value}>
      {isClient ? children : null}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}
