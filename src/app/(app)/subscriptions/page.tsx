import { getSubscriptions } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Subscription, LeadStatus } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail, MapPin, Phone, MessageSquare, History } from 'lucide-react';
import { LeadHistoryDialog } from './lead-history-dialog';
import { ContactButton } from '../leads/[id]/contact-button';
import { BackButton } from '@/components/back-button';


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

function SubscriptionCard({ sub }: { sub: Subscription }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
            <div>
                 <p className="font-semibold">{sub.name}</p>
                 <Badge variant={getStatusVariant(sub.status || 'New')}>
                    {sub.status || 'New'}
                  </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {sub.createdAt.toLocaleDateString()}
            </p>
        </div>
         <div>
            <p className="text-sm font-medium">Plan Details</p>
            <p className="text-sm text-muted-foreground">Purifier: {sub.purifierName}</p>
            <p className="text-sm text-muted-foreground">Plan: {sub.planName}</p>
            <p className="text-sm text-muted-foreground">Tenure: {sub.tenure}</p>
        </div>
        <div>
            <p className="text-sm font-medium">Contact</p>
            <div className="flex items-center gap-2 mt-1">
                 <a href={`mailto:${sub.email}`} className="text-primary hover:underline text-sm flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {sub.email}
                </a>
                 <a href={`tel:${sub.phone}`} className="text-primary hover:underline text-sm flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {sub.phone}
                </a>
            </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
            <ContactButton leadId={sub._id} leadType="Subscription" contactMethod="Call" phone={sub.phone}>
              <Phone className="mr-2 h-4 w-4" /> Call ({sub.callCount || 0})
            </ContactButton>
            <ContactButton leadId={sub._id} leadType="Subscription" contactMethod="WhatsApp" phone={sub.phone}>
              <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp ({sub.whatsAppCount || 0})
            </ContactButton>
            {sub.location && (
                <Button variant="outline" size="sm" asChild>
                    <Link href={sub.location} target="_blank">
                    <MapPin className="mr-2 h-4 w-4" /> Map
                    </Link>
                </Button>
            )}
            <LeadHistoryDialog lead={{...sub, leadType: 'Subscription'}} />
        </div>
      </CardContent>
    </Card>
  );
}

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Subscriptions</CardTitle>
            <BackButton />
        </div>
        <CardDescription>
          All user subscriptions and their status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Plan Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub: Subscription) => (
                <TableRow key={sub._id}>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell>
                    <div>
                      <a
                        href={`mailto:${sub.email}`}
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                       <Mail className="h-3 w-3" /> {sub.email}
                      </a>
                    </div>
                    <div>
                      <a
                        href={`tel:${sub.phone}`}
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />{sub.phone}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>Purifier: {sub.purifierName}</div>
                    <div>Plan: {sub.planName}</div>
                    <div>Tenure: {sub.tenure}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(sub.status || 'New')}>
                      {sub.status || 'New'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sub.createdAt
                      ? new Date(sub.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="space-x-2 flex items-center">
                    <ContactButton leadId={sub._id} leadType="Subscription" contactMethod="Call" phone={sub.phone}>
                      <Phone className="mr-2 h-4 w-4" /> Call ({sub.callCount || 0})
                    </ContactButton>
                    <ContactButton leadId={sub._id} leadType="Subscription" contactMethod="WhatsApp" phone={sub.phone}>
                      <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp ({sub.whatsAppCount || 0})
                    </ContactButton>
                    {sub.location && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={sub.location} target="_blank">
                          <MapPin className="mr-2 h-4 w-4" /> Map
                        </Link>
                      </Button>
                    )}
                    <LeadHistoryDialog
                      lead={{ ...sub, leadType: 'Subscription' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden space-y-4">
          {subscriptions.map((sub) => (
            <SubscriptionCard key={sub._id} sub={sub} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
