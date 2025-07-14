import type { Contact, FreeTrial, Referral, Subscription } from '@/types';
import { getDb } from '@/lib/mongodb';

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
