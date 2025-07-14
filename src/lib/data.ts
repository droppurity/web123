import type { Contact, FreeTrial, Referral, Subscription, Lead } from '@/types';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function getContacts(): Promise<Contact[]> {
  const db = await getDb();
  const contacts = await db.collection('contacts').find({}).toArray();
  return contacts.map(d => ({ ...d, _id: d._id.toString() })) as Contact[];
}

export async function getFreeTrials(): Promise<FreeTrial[]> {
  const db = await getDb();
  const trials = await db.collection('free_trials').find({}).toArray();
  return trials.map(d => ({ ...d, _id: d._id.toString() })) as FreeTrial[];
}

export async function getReferrals(): Promise<Referral[]> {
  const db = await getDb();
  const referrals = await db.collection('referrals').find({}).toArray();
  return referrals.map(d => ({ ...d, _id: d._id.toString() })) as Referral[];
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const db = await getDb();
  const subscriptions = await db.collection('subscriptions').find({}).toArray();
  return subscriptions.map(d => ({ ...d, _id: d._id.toString() })) as Subscription[];
}

export async function getLeadById(paramId: string): Promise<Lead | null> {
  const db = await getDb();

  let leadType: 'Subscription' | 'Free Trial' | null = null;
  let id: string | null = null;

  if (paramId.startsWith('Subscription-')) {
    leadType = 'Subscription';
    id = paramId.substring('Subscription-'.length);
  } else if (paramId.startsWith('Free-Trial-')) {
    leadType = 'Free Trial';
    id = paramId.substring('Free-Trial-'.length);
  }

  if (!leadType || !id || !ObjectId.isValid(id)) {
    return null;
  }
  
  const objectId = new ObjectId(id);
  
  if (leadType === 'Subscription') {
    const subscription = await db.collection('subscriptions').findOne({ _id: objectId });
    if (subscription) {
      return { ...subscription, _id: subscription._id.toString(), leadType: 'Subscription' } as Lead;
    }
  } else if (leadType === 'Free Trial') {
    const freeTrial = await db.collection('free_trials').findOne({ _id: objectId });
    if (freeTrial) {
      return { ...freeTrial, _id: freeTrial._id.toString(), leadType: 'Free Trial' } as Lead;
    }
  }

  return null;
}
