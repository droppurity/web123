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
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { Droplet, Users, Clock3, Share2, CreditCard } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const navItems = [
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/free-trials', label: 'Free Trials', icon: Clock3 },
  { href: '/referrals', label: 'Referrals', icon: Share2 },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
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
                  isActive={pathname.startsWith(item.href)}
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
      <SidebarInset>
        <div className="p-4 md:hidden border-b sticky top-0 bg-background z-10">
          <SidebarTrigger />
        </div>
        <div className="p-4 lg:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
