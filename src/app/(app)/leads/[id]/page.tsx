import { getLeadById } from '@/lib/data';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  User,
  Tag,
  Hash,
  Box,
} from 'lucide-react';
import { LeadHistoryDialog } from '../../subscriptions/lead-history-dialog';
import type { Subscription, FreeTrial, LeadStatus } from '@/types';
import { ContactButton } from './contact-button';

function getStatusVariant(status: LeadStatus) {
  switch (status) {
    case 'Converted':
      return 'default';
    case 'New':
      return 'secondary';
    case 'Contacted':
      return 'outline';
    case 'Closed':
      return 'destructive';
    default:
      return 'outline';
  }
}

function LeadDetail({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value?: string | null;
  icon: React.ElementType;
  href?: string;
}) {
  if (!value) return null;
  const Icon = icon;
  const content = href ? (
    <a href={href} className="font-semibold text-primary hover:underline break-all">
      {value}
    </a>
  ) : (
    <p className="text-base font-semibold break-all">{value}</p>
  );

  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {content}
      </div>
    </div>
  );
}

export default async function LeadPage({ params }: { params: { id: string } }) {
  const lead = await getLeadById(params.id);

  if (!lead) {
    notFound();
  }

  const isSubscription = lead.leadType === 'Subscription';
  const sub = isSubscription ? (lead as Subscription) : null;
  const trial = !isSubscription ? (lead as FreeTrial) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex-col md:flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{lead.name}</CardTitle>
              <CardDescription className='mt-2'>
                <Badge
                  variant={
                    isSubscription
                      ? 'default'
                      : 'secondary'
                  }
                  className="mr-2"
                >
                  {lead.leadType}
                </Badge>
                <Badge variant={getStatusVariant(lead.status || 'New')}>
                  {lead.status || 'New'}
                </Badge>
              </CardDescription>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
               <ContactButton leadId={lead._id} leadType={lead.leadType} contactMethod="Call" phone={lead.phone}>
                <Phone className="mr-2 h-4 w-4" /> Call ({lead.callCount || 0})
              </ContactButton>
              <ContactButton leadId={lead._id} leadType={lead.leadType} contactMethod="WhatsApp" phone={lead.phone}>
                <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp ({lead.whatsAppCount || 0})
              </ContactButton>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              <LeadDetail label="Name" value={lead.name} icon={User} />
              <LeadDetail
                label="Email"
                value={lead.email}
                icon={Mail}
                href={`mailto:${lead.email}`}
              />
              <LeadDetail
                label="Phone"
                value={lead.phone}
                icon={Phone}
                href={`tel:${lead.phone}`}
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Lead Details</h3>
              <LeadDetail
                label="Plan"
                value={sub?.planName || trial?.planName}
                icon={Tag}
              />
              <LeadDetail
                label="Purifier"
                value={sub?.purifierName || trial?.purifierName}
                icon={Box}
              />
              <LeadDetail
                label="Tenure"
                value={sub?.tenure || trial?.tenure}
                icon={Clock}
              />
            </div>
             <div className="space-y-4 md:col-span-2">
                <h3 className="font-semibold text-lg">Location</h3>
                 <LeadDetail label="Address" value={lead.address} icon={MapPin} />
                {lead.location && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={lead.location} target="_blank">
                        <MapPin className="mr-2 h-4 w-4" /> View on Map
                      </Link>
                    </Button>
                  )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky top-4">
          <CardHeader>
            <CardTitle>Manage Lead</CardTitle>
            <CardDescription>
              Add interactions and update status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadHistoryDialog lead={lead} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
