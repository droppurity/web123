'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import {
  Droplet,
  Users,
  Clock3,
  Share2,
  CreditCard,
  LayoutDashboard,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/free-trials', label: 'Free Trials', icon: Clock3 },
  { href: '/referrals', label: 'Referrals', icon: Share2 },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (itemHref: string) => {
    if (itemHref === '/dashboard') {
      return pathname === itemHref || pathname.startsWith('/leads/');
    }
    return pathname.startsWith(itemHref);
  };

  const sidebarContent = (
    <>
      <SidebarHeader className="border-b">
        <Link href="/" className="flex items-center gap-2 p-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Droplet className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold">DropPurity</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                className="w-full"
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen">
        <header className="p-4 border-b sticky top-0 bg-background z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar>
                  <div className="flex flex-col h-full">{sidebarContent}</div>
                </Sidebar>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                <Droplet className="h-5 w-5" />
              </div>
              <h1 className="text-lg font-semibold">DropPurity</h1>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
