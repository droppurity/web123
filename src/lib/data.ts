import type { Contact, FreeTrial, Referral, Subscription } from '@/types';

const contacts: Contact[] = [
  { _id: '1', name: 'John Doe', email: 'john.doe@example.com', message: 'Interested in your pro plan.', createdAt: new Date('2023-10-01') },
  { _id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', message: 'What is the pricing for enterprise?', createdAt: new Date('2023-10-02') },
  { _id: '3', name: 'Peter Jones', email: 'peter.jones@example.com', message: 'I have a support question.', createdAt: new Date('2023-10-03') },
];

const freeTrials: FreeTrial[] = [
    { _id: '1', email: 'trial1@example.com', plan: 'Basic', startDate: new Date('2023-09-15'), endDate: new Date('2023-09-30') },
    { _id: '2', email: 'trial2@example.com', plan: 'Pro', startDate: new Date('2023-09-20'), endDate: new Date('2023-10-05') },
    { _id: '3', email: 'trial3@example.com', plan: 'Enterprise', startDate: new Date('2023-10-01'), endDate: new Date('2023-10-16') },
];

const referrals: Referral[] = [
    { _id: '1', referrerEmail: 'user1@example.com', referredEmail: 'newuser1@example.com', status: 'Completed', createdAt: new Date('2023-08-20') },
    { _id: '2', referrerEmail: 'user2@example.com', referredEmail: 'newuser2@example.com', status: 'Pending', createdAt: new Date('2023-09-25') },
    { _id: '3', referrerEmail: 'user3@example.com', referredEmail: 'newuser3@example.com', status: 'Expired', createdAt: new Date('2023-07-10') },
];

const subscriptions: Subscription[] = [
    { _id: '1', userEmail: 'sub1@example.com', plan: 'Monthly', status: 'Active', startDate: new Date('2023-01-01'), endDate: null },
    { _id: '2', userEmail: 'sub2@example.com', plan: 'Yearly', status: 'Active', startDate: new Date('2023-02-15'), endDate: null },
    { _id: '3', userEmail: 'sub3@example.com', plan: 'Monthly', status: 'Canceled', startDate: new Date('2023-05-10'), endDate: new Date('2023-09-10') },
    { _id: '4', userEmail: 'sub4@example.com', plan: 'Monthly', status: 'Past Due', startDate: new Date('2023-08-01'), endDate: null },
];

export async function getContacts(): Promise<Contact[]> {
  return new Promise(resolve => setTimeout(() => resolve(contacts), 500));
}

export async function getFreeTrials(): Promise<FreeTrial[]> {
  return new Promise(resolve => setTimeout(() => resolve(freeTrials), 500));
}

export async function getReferrals(): Promise<Referral[]> {
  return new Promise(resolve => setTimeout(() => resolve(referrals), 500));
}

export async function getSubscriptions(): Promise<Subscription[]> {
  return new Promise(resolve => setTimeout(() => resolve(subscriptions), 500));
}
