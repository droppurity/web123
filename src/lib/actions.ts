'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from './mongodb';
import { LeadStatus } from '@/types';
import { ObjectId } from 'mongodb';

async function getCollectionName(leadType: string) {
  if (leadType === 'Subscription') {
    return 'subscriptions';
  } else if (leadType === 'Free Trial') {
    return 'free_trials';
  }
  throw new Error('Invalid lead type');
}

export async function addInteraction(
  prevState: { message: string },
  formData: FormData
) {
  const db = await getDb();
  const leadId = formData.get('leadId') as string;
  const leadType = formData.get('leadType') as string;
  const notes = formData.get('notes') as string;
  const interactionType = formData.get('interactionType') as 'Call' | 'WhatsApp' | 'Note';

  if (!leadId || !leadType || !notes || !interactionType) {
    return { message: 'Missing required fields.' };
  }

  try {
    const collectionName = await getCollectionName(leadType);
    const newInteraction = {
      _id: new ObjectId(),
      type: interactionType,
      notes,
      createdAt: new Date(),
    };

    await db.collection(collectionName).updateOne(
      { _id: new ObjectId(leadId) },
      { 
        $push: { interactions: newInteraction },
        $set: { status: 'Contacted' as LeadStatus }
      }
    );

    revalidatePath('/dashboard');
    revalidatePath('/subscriptions');
    revalidatePath('/free-trials');
    revalidatePath(`/leads/${leadType.replace(' ', '-')}-${leadId}`);
    return { message: 'Interaction added successfully.' };
  } catch (e) {
    console.error(e);
    return { message: 'Failed to add interaction.' };
  }
}

export async function updateLeadStatus(
  prevState: { message: string },
  formData: FormData
) {
  const db = await getDb();
  const leadId = formData.get('leadId') as string;
  const leadType = formData.get('leadType') as string;
  const status = formData.get('status') as LeadStatus;
  const reason = formData.get('reason') as string;

  if (!leadId || !leadType || !status) {
    return { message: 'Missing required fields.' };
  }
  
  const updatePayload: { status: LeadStatus, closedReason?: string } = { status };

  if (status === 'Closed' && reason) {
    updatePayload.closedReason = reason;
  }

  try {
    const collectionName = await getCollectionName(leadType);
    await db.collection(collectionName).updateOne(
      { _id: new ObjectId(leadId) },
      { $set: updatePayload }
    );
    revalidatePath('/dashboard');
    revalidatePath('/subscriptions');
    revalidatePath('/free-trials');
    revalidatePath(`/leads/${leadType.replace(' ', '-')}-${leadId}`);
    return { message: 'Status updated successfully.' };
  } catch (e) {
    console.error(e);
    return { message: 'Failed to update status.' };
  }
}
