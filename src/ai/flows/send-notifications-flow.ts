
'use server';

import { ai } from '@/ai/genkit';
import { getDb } from '@/lib/mongodb';
import { z } from 'zod';
import webpush from 'web-push';

if (process.env.VAPID_PRIVATE_KEY && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    webpush.setVapidDetails(
        'mailto:your-email@example.com',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}


export const sendNewLeadNotifications = ai.defineFlow(
  {
    name: 'sendNewLeadNotifications',
    inputSchema: z.void(),
    outputSchema: z.any(),
  },
  async () => {
    const db = await getDb();
    const subscriptions = await db.collection('push_subscriptions').find({}).toArray();

    if (subscriptions.length === 0) {
      return { sent: 0, failed: 0, message: "No subscriptions to send to." };
    }
    
    const notificationPayload = JSON.stringify({
        title: 'New Lead Received!',
        body: 'A new lead has been added. Check your dashboard.',
        icon: '/icon-192x192.png',
        data: {
            url: '/dashboard'
        }
    });

    const sendPromises = subscriptions.map(sub => {
        const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth
            }
        };
        return webpush.sendNotification(pushSubscription, notificationPayload)
            .catch(err => {
                console.error("Failed to send notification to", sub.endpoint, err.statusCode, err.body);
                // If subscription is gone, we should remove it from our DB
                if (err.statusCode === 410) {
                    return db.collection('push_subscriptions').deleteOne({ _id: sub._id });
                }
                return { error: true, endpoint: sub.endpoint, statusCode: err.statusCode };
            });
    });

    const results = await Promise.allSettled(sendPromises);
    
    const sentCount = results.filter(r => r.status === 'fulfilled' && !r.value?.error).length;
    const failedCount = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value?.error)).length;
    
    return { sent: sentCount, failed: failedCount };
  }
);
