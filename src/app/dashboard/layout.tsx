'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  CircuitBoard,
  FileUp,
  LayoutDashboard,
  Map,
  Settings,
  ShieldCheck,
  GitCompareArrows,
  CircleDollarSign,
  Users,
  History,
  CloudLightning,
  Target,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import DashboardHeader from './components/dashboard-header';
import { VajraIcon } from '@/components/icons';
import { useUserRole } from '@/contexts/user-role-context';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Chatbot } from '@/components/chatbot/chatbot';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { role, userName } = useUserRole();
  const userAvatarImage = PlaceHolderImages.find(p => p.id === 'user-avatar-1');

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/map-view', icon: Map, label: 'Map View' },
    {
      href: '/dashboard/transformers',
      icon: CircuitBoard,
      label: 'Transformers',
    },
    { href: '/dashboard/analysis', icon: FileUp, label: 'Analysis' },
  ];

  const managerMenuItems = [
    {
      href: '/dashboard/comparison',
      icon: GitCompareArrows,
      label: 'Comparison',
    },
    {
      href: '/dashboard/budgeting',
      icon: CircleDollarSign,
      label: 'Budgeting',
    },
     {
      href: '/dashboard/performance',
      icon: Users,
      label: 'Performance',
    },
    {
        href: '/dashboard/audit-trail',
        icon: History,
        label: 'Audit Trail',
    },
     {
        href: '/dashboard/environmental',
        icon: CloudLightning,
        label: 'Environmental',
    },
    {
        href: '/dashboard/kpis',
        icon: Target,
        label: 'KPIs',
    },
     {
        href: '/dashboard/workflow',
        icon: ClipboardList,
        label: 'Workflow',
    },
  ];

  const settingsItem = {
    href: '/dashboard/settings',
    icon: Settings,
    label: 'Settings',
  };
  
  const userMenuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  ];

  const itemsToDisplay = role === 'user' ? userMenuItems : menuItems;

  const getInitials = (name: string) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <VajraIcon className="w-8 h-8 text-primary" />
            <span className="font-headline text-2xl font-semibold text-primary">
              VajraAI
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {itemsToDisplay.map(item => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className="w-full justify-start"
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          {role === 'manager' && (
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center">
                <ShieldCheck className="mr-2" />
                Manager Tools
              </SidebarGroupLabel>
              <SidebarMenu>
                {managerMenuItems.map(item => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className="w-full justify-start"
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}

          <SidebarMenu className="mt-auto">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === settingsItem.href}
                className="w-full justify-start"
              >
                <Link href={settingsItem.href}>
                  <settingsItem.icon className="mr-2 h-4 w-4" />
                  <span>{settingsItem.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {userAvatarImage && (
                <AvatarImage
                  src={userAvatarImage.imageUrl}
                  alt="User Avatar"
                  data-ai-hint={userAvatarImage.imageHint}
                />
              )}
              <AvatarFallback>{getInitials(userName)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">{userName}</span>
              <span className="text-sm text-muted-foreground capitalize">
                {role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        <Chatbot />
      </SidebarInset>
    </SidebarProvider>
  );
}
