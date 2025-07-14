'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSheetTrigger,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import {
  Droplet,
  Users,
  Clock3,
  Share2,
  CreditCard,
  LayoutDashboard,
  PanelLeft,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent } from './ui/sheet';

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

  const desktopSidebar = (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b">
        <Link href="/" className="flex items-center gap-2 p-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Droplet className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
            DropPurity
          </h1>
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
                tooltip={{ children: item.label, side: 'right' }}
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
    </Sidebar>
  );

  return (
    <SidebarProvider>
      {desktopSidebar}
      <SidebarInset>
        <Sheet>
          <div className="p-4 md:hidden border-b sticky top-0 bg-background z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                <Droplet className="h-5 w-5" />
              </div>
              <h1 className="text-lg font-semibold">DropPurity</h1>
            </Link>
            <SidebarSheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <PanelLeft />
              </Button>
            </SidebarSheetTrigger>
          </div>
          <SheetContent side="left" className="p-0 w-64">
            {/* We are re-rendering the same sidebar for mobile, but inside the SheetContent */}
            {desktopSidebar}
          </SheetContent>
          <div className="p-4 lg:p-6">{children}</div>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
  );
}