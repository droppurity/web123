
import { sendNewLeadNotifications } from '@/ai/flows/send-notifications-flow';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { secret } = await req.json();

  if (secret !== process.env.NOTIFICATION_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await sendNewLeadNotifications();
    return NextResponse.json({ message: 'Notifications sent successfully.', result });
  } catch (error) {
    console.error('Failed to send notifications:', error);
    return NextResponse.json({ message: 'Failed to send notifications.' }, { status: 500 });
  }
}
