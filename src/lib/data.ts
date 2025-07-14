import type { Contact, FreeTrial, Referral, Subscription, Lead, Interaction } from '@/types';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function getInteractionsForLeads<T extends (Subscription | FreeTrial)>(leads: T[], leadType: 'Subscription' | 'Free Trial'): Promise<(T & { interactions: Interaction[], callCount: number, whatsAppCount: number })[]> {
  if (leads.length === 0) return [];
  
  const db = await getDb();
  const leadIds = leads.map(l => new ObjectId(l._id));
  
  const interactions = await db.collection('interactions').find({ leadId: { $in: leadIds } }).sort({ createdAt: -1 }).toArray();

  return leads.map(lead => {
    const leadInteractions = interactions.filter(i => i.leadId.toString() === lead._id.toString()) as Interaction[];
    const callCount = leadInteractions.filter(i => i.type === 'Call').length;
    const whatsAppCount = leadInteractions.filter(i => i.type === 'WhatsApp').length;

    return {
      ...lead,
      leadType,
      interactions: leadInteractions.map(i => ({...i, _id: i._id.toString()})),
      callCount,
      whatsAppCount
    };
  });
}

export async function getContacts(): Promise<Contact[]> {
  const db = await getDb();
  const contacts = await db.collection('contacts').find({}).sort({createdAt: -1}).toArray();
  return contacts.map(d => ({ ...d, _id: d._id.toString() })) as Contact[];
}

export async function getFreeTrials(): Promise<(FreeTrial & { leadType: 'Free Trial', interactions: Interaction[], callCount: number, whatsAppCount: number })[]> {
  const db = await getDb();
  const trials = await db.collection('free_trials').find({}).sort({createdAt: -1}).toArray();
  const trialsWithIds = trials.map(d => ({ ...d, _id: d._id.toString() })) as FreeTrial[];
  return getInteractionsForLeads(trialsWithIds, 'Free Trial');
}

export async function getReferrals(): Promise<Referral[]> {
  const db = await getDb();
  const referrals = await db.collection('referrals').find({}).sort({createdAt: -1}).toArray();
  return referrals.map(d => ({ ...d, _id: d._id.toString() })) as Referral[];
}

export async function getSubscriptions(): Promise<(Subscription & { leadType: 'Subscription', interactions: Interaction[], callCount: number, whatsAppCount: number })[]> {
  const db = await getDb();
  const subscriptions = await db.collection('subscriptions').find({}).sort({createdAt: -1}).toArray();
  const subscriptionsWithIds = subscriptions.map(d => ({ ...d, _id: d._id.toString() })) as Subscription[];
  return getInteractionsForLeads(subscriptionsWithIds, 'Subscription');
}

export async function getLeadById(paramId: string): Promise<Lead | null> {
  const db = await getDb();

  let leadType: 'Subscription' | 'Free Trial' | null = null;
  let id: string | null = null;
  
  const parts = paramId.split('-');
  if (paramId.startsWith('Subscription-')) {
    leadType = 'Subscription';
    id = parts[1];
  } else if (paramId.startsWith('Free-Trial-')) {
    leadType = 'Free Trial';
    id = parts[2];
  }

  if (!leadType || !id || !ObjectId.isValid(id)) {
    return null;
  }
  
  const objectId = new ObjectId(id);
  
  let leadData: Subscription | FreeTrial | null = null;
  if (leadType === 'Subscription') {
    leadData = await db.collection('subscriptions').findOne({ _id: objectId }) as Subscription | null;
  } else if (leadType === 'Free Trial') {
    leadData = await db.collection('free_trials').findOne({ _id: objectId }) as FreeTrial | null;
  }

  if (!leadData) {
    return null;
  }
  
  leadData._id = leadData._id.toString();

  const [leadWithDetails] = await getInteractionsForLeads([leadData], leadType);

  return leadWithDetails as Lead;
}
