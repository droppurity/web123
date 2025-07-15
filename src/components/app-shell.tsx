'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Droplet,
  Users,
  Clock3,
  Share2,
  CreditCard,
  LayoutDashboard,
  Menu,
  MessageSquare,
} from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { RefreshButton } from './refresh-button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/free-trials', label: 'Free Trials', icon: Clock3 },
  { href: '/referrals', label: 'Referrals', icon: Share2 },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/interactions', label: 'Interactions', icon: MessageSquare },
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
      <header className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Droplet className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold">DropPurity</h1>
        </Link>
      </header>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={isActive(item.href) ? 'secondary' : 'ghost'}
            className="w-full justify-start"
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </>
  );

  return (
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
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Droplet className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-semibold">DropPurity</h1>
          </Link>
        </div>
        <RefreshButton />
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
