'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from './mongodb';
import { LeadStatus } from '@/types';
import { ObjectId } from 'mongodb';

export async function addInteraction(
  prevState: { message: string },
  formData: FormData
) {
  const db = await getDb();
  const subscriptionId = formData.get('subscriptionId') as string;
  const notes = formData.get('notes') as string;
  const interactionType = formData.get('interactionType') as 'Call' | 'WhatsApp' | 'Note';

  if (!subscriptionId || !notes || !interactionType) {
    return { message: 'Missing required fields.' };
  }

  try {
    const newInteraction = {
      _id: new ObjectId(),
      type: interactionType,
      notes,
      createdAt: new Date(),
    };

    await db.collection('subscriptions').updateOne(
      { _id: new ObjectId(subscriptionId) },
      { 
        $push: { interactions: newInteraction },
        $set: { status: 'Contacted' as LeadStatus }
      }
    );

    revalidatePath('/subscriptions');
    return { message: 'Interaction added successfully.' };
  } catch (e) {
    console.error(e);
    return { message: 'Failed to add interaction.' };
  }
}

export async function updateSubscriptionStatus(
  prevState: { message: string },
  formData: FormData
) {
  const db = await getDb();
  const subscriptionId = formData.get('subscriptionId') as string;
  const status = formData.get('status') as LeadStatus;
  const reason = formData.get('reason') as string;

  if (!subscriptionId || !status) {
    return { message: 'Missing required fields.' };
  }
  
  const updatePayload: { status: LeadStatus, closedReason?: string } = { status };

  if (status === 'Closed' && reason) {
    updatePayload.closedReason = reason;
  }

  try {
    await db.collection('subscriptions').updateOne(
      { _id: new ObjectId(subscriptionId) },
      { $set: updatePayload }
    );
    revalidatePath('/subscriptions');
    return { message: 'Status updated successfully.' };
  } catch (e) {
    console.error(e);
    return { message: 'Failed to update status.' };
  }
}
