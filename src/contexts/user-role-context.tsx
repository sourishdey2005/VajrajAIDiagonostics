"use client";

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

export type Role = 'field_engineer' | 'manager';

type UserRoleContextType = {
  role: Role;
  setRole: Dispatch<SetStateAction<Role>>;
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('field_engineer');

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
