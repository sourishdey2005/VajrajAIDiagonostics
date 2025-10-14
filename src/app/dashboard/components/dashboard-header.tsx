"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  ChevronRight
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { cn } from "@/lib/utils"
import { useUserRole } from "@/contexts/user-role-context"

export default function DashboardHeader() {
  const pathname = usePathname()
  const { userName } = useUserRole();
  const userAvatarImage = PlaceHolderImages.find(p => p.id === 'user-avatar-1');
  
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const getInitials = (name: string) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }


  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30 md:static">
      <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1">
        <nav className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          {pathSegments.slice(1).map((segment, index) => {
            const href = "/" + pathSegments.slice(0, index + 2).join('/');
            const isLast = index === pathSegments.length - 2;
            return (
              <React.Fragment key={href}>
                <ChevronRight className="h-4 w-4" />
                <Link
                  href={href}
                  className={cn("capitalize", !isLast && "hover:text-foreground", isLast && "text-foreground")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {segment.replace('-', ' ')}
                </Link>
              </React.Fragment>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                {userAvatarImage && <AvatarImage src={userAvatarImage.imageUrl} alt="User Avatar" data-ai-hint={userAvatarImage.imageHint} />}
                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/login">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
