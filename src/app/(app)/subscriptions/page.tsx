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
import { Subscription } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Phone, MessageSquare } from 'lucide-react';
import { LeadHistoryDialog } from './lead-history-dialog';

function getStatusVariant(status: Subscription['status']) {
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

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriptions</CardTitle>
        <CardDescription>
          All user subscriptions and their status.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                  <div>{sub.email}</div>
                  <div>{sub.phone}</div>
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
                   <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${sub.phone}`}>
                        <Phone className="mr-2 h-4 w-4" /> Call
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                       <a href={`https://wa.me/${sub.phone}`} target="_blank">
                        <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp
                      </a>
                    </Button>
                  {sub.location && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={sub.location} target="_blank">
                        <MapPin className="mr-2 h-4 w-4" /> Map
                      </Link>
                    </Button>
                  )}
                  <LeadHistoryDialog lead={{...sub, leadType: 'Subscription'}} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
