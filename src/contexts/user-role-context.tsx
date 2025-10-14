"use client";

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

export type Role = 'field_engineer' | 'manager' | 'user';

type UserRoleContextType = {
  role: Role;
  setRole: Dispatch<SetStateAction<Role>>;
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

  useEffect(() => {
    try {
        localStorage.setItem('userRole', role);
    } catch (error) {
        console.error("Failed to save role to localStorage", error);
    }
  }, [role]);

  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
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
