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
  const [role, setRole] = useState<Role>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedRole = localStorage.getItem('userRole') as Role;
        return savedRole ? savedRole : 'user'; 
      } catch (error) {
        console.error("Failed to read role from localStorage", error);
        return 'user';
      }
    }
    return 'user';
  });
  
  const [userName, setUserName] = useState<string>(() => {
      if (typeof window !== 'undefined') {
          try {
              const savedUserName = localStorage.getItem('userName');
              return savedUserName ? savedUserName : "User";
          } catch (error) {
              console.error("Failed to read user name from localStorage", error);
              return "User";
          }
      }
      return "User";
  });

  useEffect(() => {
    try {
        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', userName);
    } catch (error) {
        console.error("Failed to save to localStorage", error);
    }
  }, [role, userName]);

  return (
    <UserRoleContext.Provider value={{ role, setRole, userName, setUserName }}>
      {children}
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
