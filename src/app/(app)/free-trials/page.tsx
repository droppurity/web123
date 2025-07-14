import { getFreeTrials } from '@/lib/data';
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
import { FreeTrial, LeadStatus } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Phone, MessageSquare } from 'lucide-react';
import { LeadHistoryDialog } from '../subscriptions/lead-history-dialog';

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

export default async function FreeTrialsPage() {
  const freeTrials = await getFreeTrials();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Free Trials</CardTitle>
        <CardDescription>
          Users who have signed up for a free trial.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Purifier</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Tenure</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {freeTrials.map((trial: FreeTrial) => (
              <TableRow key={trial._id}>
                <TableCell className="font-medium">{trial.name}</TableCell>
                <TableCell>
                  <div>{trial.email}</div>
                  <div>{trial.phone}</div>
                </TableCell>
                <TableCell>{trial.address}</TableCell>
                <TableCell>{trial.purifierName}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{trial.planName}</Badge>
                </TableCell>
                <TableCell>{trial.tenure}</TableCell>
                 <TableCell>
                   <Badge variant={getStatusVariant(trial.status || 'New')}>
                    {trial.status || 'New'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {trial.createdAt
                    ? new Date(trial.createdAt).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell className="space-x-2 flex items-center">
                   <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${trial.phone}`}>
                        <Phone className="mr-2 h-4 w-4" /> Call
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                       <a href={`https://wa.me/${trial.phone}`} target="_blank">
                        <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp
                      </a>
                    </Button>
                  {trial.location && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={trial.location} target="_blank">
                        <MapPin className="mr-2 h-4 w-4" /> Map
                      </Link>
                    </Button>
                  )}
                  <LeadHistoryDialog lead={{...trial, leadType: 'Free Trial'}} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
