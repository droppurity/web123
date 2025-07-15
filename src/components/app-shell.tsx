'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Droplet,
  Users,
  Clock3,
  Share2,
  CreditCard,
  LayoutDashboard,
  Menu,
  MessageSquare,
  RefreshCw,
  Bell,
} from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { RefreshButton } from './refresh-button';
import { useState, useRef, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/free-trials', label: 'Free Trials', icon: Clock3 },
  { href: '/referrals', label: 'Referrals', icon: Share2 },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/interactions', label: 'Interactions', icon: MessageSquare },
];

function PushNotificationButton() {
  const { toast } = useToast();
  const {
    isSubscribed,
    subscribe,
    unsubscribe,
    userSubscription,
    isSubscriptionLoading,
  } = usePushNotifications();

  const handleSubscribe = async () => {
    try {
      await subscribe();
      toast({ title: 'Success', description: 'You are now subscribed to new lead notifications.' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Subscription Failed',
        description: 'Could not subscribe to notifications. Please ensure you have granted permission.',
        variant: 'destructive',
      });
    }
  };
  
  const handleUnsubscribe = async () => {
    try {
      await unsubscribe();
      toast({ title: 'Success', description: 'You have unsubscribed from notifications.' });
    } catch (error) {
      console.error(error);
       toast({
        title: 'Unsubscription Failed',
        description: 'Could not unsubscribe.',
        variant: 'destructive',
      });
    }
  };


  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
      disabled={isSubscriptionLoading}
      aria-label={isSubscribed ? "Unsubscribe from notifications" : "Subscribe to notifications"}
    >
      <Bell className={cn(isSubscribed && "fill-primary text-primary")} />
    </Button>
  );
}


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const mainRef = useRef<HTMLElement>(null);
  const [pullState, setPullState] = useState({
    startY: 0,
    pullChange: 0,
    isPulling: false,
  });

  const PULL_THRESHOLD = 70;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (mainRef.current && mainRef.current.scrollTop === 0) {
      setPullState(prev => ({ ...prev, startY: e.touches[0].clientY, isPulling: true }));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pullState.isPulling) return;
    
    const pullChange = e.touches[0].clientY - pullState.startY;
    if (pullChange > 0) {
      e.preventDefault(); // Prevent browser's default pull-to-refresh
      setPullState(prev => ({ ...prev, pullChange: Math.min(pullChange, PULL_THRESHOLD + 20) }));
    } else {
      setPullState(prev => ({ ...prev, isPulling: false, pullChange: 0 }));
    }
  };

  const handleTouchEnd = () => {
    if (pullState.pullChange > PULL_THRESHOLD) {
      startTransition(() => {
        router.refresh();
      });
    }
    setPullState({ startY: 0, pullChange: 0, isPulling: false });
  };


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
    <div className="flex flex-col h-screen bg-background">
      <header className="p-4 border-b sticky top-0 bg-background z-20 flex items-center justify-between">
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
        <div className="flex items-center">
            <PushNotificationButton />
            <RefreshButton />
        </div>
      </header>
      <div className="relative flex-1">
        <div 
          className="absolute top-0 left-0 right-0 flex justify-center items-center -z-10"
          style={{ 
            height: `${pullState.pullChange}px`,
            opacity: Math.min(pullState.pullChange / PULL_THRESHOLD, 1),
          }}
        >
          <RefreshCw className={cn("h-6 w-6 text-muted-foreground", (isPending || pullState.pullChange > PULL_THRESHOLD) && "animate-spin")} />
        </div>
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto h-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translateY(${pullState.pullChange}px)`,
            transition: pullState.isPulling ? 'none' : 'transform 0.3s',
          }}
        >
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
