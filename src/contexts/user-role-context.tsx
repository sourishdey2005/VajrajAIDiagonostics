
"use client";

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

export type Role = 'field_engineer' | 'manager' | 'user';

export type FieldEngineerAccount = {
  name: string;
  email: string;
  password?: string; // Password is used for creation, but shouldn't be exposed elsewhere
}

type UserRoleContextType = {
  role: Role;
  setRole: Dispatch<SetStateAction<Role>>;
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
  fieldEngineers: FieldEngineerAccount[];
  addFieldEngineer: (engineer: FieldEngineerAccount) => void;
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [role, setRole] = useState<Role>('user'); 
  const [userName, setUserName] = useState<string>("User");
  const [fieldEngineers, setFieldEngineers] = useState<FieldEngineerAccount[]>([]);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedRole = localStorage.getItem('userRole') as Role;
      if (savedRole) setRole(savedRole);
      
      const savedUserName = localStorage.getItem('userName');
      if (savedUserName) setUserName(savedUserName);

      const savedEngineers = localStorage.getItem('fieldEngineers');
      if (savedEngineers) setFieldEngineers(JSON.parse(savedEngineers));

    } catch (error) {
      console.error("Failed to read from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
          localStorage.setItem('userRole', role);
          localStorage.setItem('userName', userName);
          // Don't save passwords in a real app, this is for prototype persistence
          localStorage.setItem('fieldEngineers', JSON.stringify(fieldEngineers));
      } catch (error) {
          console.error("Failed to save to localStorage", error);
      }
    }
  }, [role, userName, isClient, fieldEngineers]);
  
  const addFieldEngineer = (engineer: FieldEngineerAccount) => {
    setFieldEngineers(prev => [...prev, engineer]);
  }

  const value = {
    role,
    setRole,
    userName,
    setUserName,
    fieldEngineers,
    addFieldEngineer,
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

    