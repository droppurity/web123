
'use client';

import { useState, useEffect } from 'react';
import { savePushSubscription, deletePushSubscription } from '@/lib/actions';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const usePushNotifications = () => {
  const [userSubscription, setUserSubscription] = useState<PushSubscription | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      setSubscriptionLoading(true);
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          setUserSubscription(subscription);
          setIsSubscribed(true);
        }
      }
      setSubscriptionLoading(false);
    };

    checkSubscription();
  }, []);
  
  useEffect(() => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(
            function (registration) {
                console.log('Service Worker registration successful with scope: ', registration.scope);
            },
            function (err) {
                console.log('Service Worker registration failed: ', err);
            }
        );
    }
  }, []);
  

  const subscribe = async () => {
    if (!VAPID_PUBLIC_KEY) {
      throw new Error('VAPID public key not configured.');
    }
    
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications are not supported by this browser.');
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
    }

    await savePushSubscription(subscription);

    setUserSubscription(subscription);
    setIsSubscribed(true);
  };
  
  const unsubscribe = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
        await deletePushSubscription(subscription);
        await subscription.unsubscribe();
    }
    
    setUserSubscription(null);
    setIsSubscribed(false);
  }

  return {
    isSubscribed,
    subscribe,
    unsubscribe,
    userSubscription,
    isSubscriptionLoading,
  };
};
