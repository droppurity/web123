export interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export interface FreeTrial {
  _id: string;
  email: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  startDate: Date;
  endDate: Date;
}

export interface Referral {
  _id: string;
  referrerEmail: string;
  referredEmail: string;
  status: 'Pending' | 'Completed' | 'Expired';
  createdAt: Date;
}

export interface Subscription {
  _id: string;
  userEmail: string;
  plan: 'Monthly' | 'Yearly';
  status: 'Active' | 'Canceled' | 'Past Due';
  startDate: Date;
  endDate: Date | null;
}
