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
  const leadType = formData.get('leadType') as 'Subscription' | 'Free Trial';
  const notes = formData.get('notes') as string;
  const interactionType = formData.get('interactionType') as 'Call' | 'WhatsApp' | 'Note';

  if (!leadId || !leadType || !notes || !interactionType) {
    return { message: 'Missing required fields.' };
  }

  try {
    const interactionsCollection = db.collection('interactions');
    const leadCollectionName = await getCollectionName(leadType);
    const lead = await db.collection(leadCollectionName).findOne({ _id: new ObjectId(leadId) });

    if (!lead) {
      return { message: 'Lead not found.' };
    }


    await interactionsCollection.insertOne({
      leadId: new ObjectId(leadId),
      leadType,
      leadName: lead.name,
      type: interactionType,
      notes,
      createdAt: new Date(),
    });

    if (lead.status !== 'Contacted') {
        await db.collection(leadCollectionName).updateOne(
          { _id: new ObjectId(leadId) },
          { $set: { status: 'Contacted' as LeadStatus } }
        );
    }


    revalidatePath('/dashboard');
    revalidatePath('/subscriptions');
    revalidatePath('/free-trials');
    revalidatePath(`/leads/${leadType.replace(' ', '-')}-${leadId}`);
    revalidatePath('/interactions');
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
    revalidatePath('/interactions');
    return { message: 'Status updated successfully.' };
  } catch (e) {
    console.error(e);
    return { message: 'Failed to update status.' };
  }
}


export async function logContactAttempt(leadId: string, leadType: 'Subscription' | 'Free Trial', contactMethod: 'Call' | 'WhatsApp') {
  const db = await getDb();
  
  if (!leadId || !leadType || !contactMethod) {
    return { success: false, message: 'Missing required fields.' };
  }

  try {
    const interactionsCollection = db.collection('interactions');
    const leadCollectionName = await getCollectionName(leadType);
    const lead = await db.collection(leadCollectionName).findOne({ _id: new ObjectId(leadId) });

    if (!lead) {
      return { success: false, message: 'Lead not found.' };
    }

    await interactionsCollection.insertOne({
      leadId: new ObjectId(leadId),
      leadType,
      leadName: lead.name,
      type: contactMethod,
      notes: `${contactMethod} attempt.`,
      createdAt: new Date(),
    });

     if (lead.status !== 'Contacted') {
        await db.collection(leadCollectionName).updateOne(
            { _id: new ObjectId(leadId) },
            { $set: { status: 'Contacted' as LeadStatus } }
        );
     }
    
    revalidatePath('/dashboard');
    revalidatePath('/subscriptions');
    revalidatePath('/free-trials');
    revalidatePath(`/leads/${leadType.replace(' ', '-')}-${leadId}`);
    revalidatePath('/interactions');

    return { success: true, message: `${contactMethod} attempt logged successfully.` };
  } catch (e) {
    console.error(e);
    return { success: false, message: `Failed to log ${contactMethod} attempt.` };
  }
}

export async function savePushSubscription(subscription: PushSubscription) {
    const db = await getDb();
    const pushSubscriptions = db.collection('push_subscriptions');
    
    // Use the endpoint as a unique key to avoid duplicate subscriptions
    await pushSubscriptions.updateOne(
        { endpoint: subscription.endpoint },
        { $set: subscription },
        { upsert: true }
    );
}

export async function deletePushSubscription(subscription: PushSubscription) {
    const db = await getDb();
    const pushSubscriptions = db.collection('push_subscriptions');
    
    await pushSubscriptions.deleteOne({ endpoint: subscription.endpoint });
}
