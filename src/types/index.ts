export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  mapLink?: string;
}

export interface FreeTrial {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  purifierName: string;
  planName: string;
  tenure: string;
  createdAt: Date;
  status: LeadStatus;
}

export interface Referral {
  _id:string;
  referrerEmail: string;
  referredEmail: string;
  status: 'Pending' | 'Completed' | 'Expired';
  createdAt: Date;
}

export type LeadStatus = 'New' | 'Contacted' | 'Converted' | 'Closed';

export interface Interaction {
  _id: string;
  leadId: string;
  leadType: 'Subscription' | 'Free Trial';
  type: 'Call' | 'WhatsApp' | 'Note';
  notes: string;
  createdAt: Date;
}

export interface Subscription {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  purifierName: string;
  planName: string;
  tenure: string;
  createdAt: Date;
  status: LeadStatus;
}

export type Lead = (Subscription | FreeTrial) & { 
  leadType: 'Subscription' | 'Free Trial',
  interactions: Interaction[],
  callCount?: number,
  whatsAppCount?: number
};
