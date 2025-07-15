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
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import { LeadHistoryDialog } from '../subscriptions/lead-history-dialog';
import { ContactButton } from '../leads/[id]/contact-button';
import { BackButton } from '@/components/back-button';

export const revalidate = 0;

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

function FreeTrialCard({ trial }: { trial: FreeTrial }) {
  return (
    <Card>
       <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
            <div>
                 <p className="font-semibold">{trial.name}</p>
                 <Badge variant={getStatusVariant(trial.status || 'New')}>
                    {trial.status || 'New'}
                  </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {trial.createdAt ? new Date(trial.createdAt).toLocaleDateString() : 'N/A'}
            </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
                <p className="font-medium">Purifier</p>
                <p className="text-muted-foreground">{trial.purifierName}</p>
            </div>
             <div>
                <p className="font-medium">Plan</p>
                <p className="text-muted-foreground">{trial.planName}</p>
            </div>
             <div>
                <p className="font-medium">Tenure</p>
                <p className="text-muted-foreground">{trial.tenure}</p>
            </div>
        </div>
        <div>
            <p className="text-sm font-medium">Address</p>
            <p className="text-sm text-muted-foreground">{trial.address}</p>
        </div>
        <div>
            <p className="text-sm font-medium">Contact</p>
            <div className="flex items-center gap-2 mt-1">
                 <a href={`mailto:${trial.email}`} className="text-primary hover:underline text-sm flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {trial.email}
                </a>
                 <a href={`tel:${trial.phone}`} className="text-primary hover:underline text-sm flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {trial.phone}
                </a>
            </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
            <ContactButton leadId={trial._id} leadType="Free Trial" contactMethod="Call" phone={trial.phone}>
              <Phone className="mr-2 h-4 w-4" /> Call ({trial.callCount || 0})
            </ContactButton>
            <ContactButton leadId={trial._id} leadType="Free Trial" contactMethod="WhatsApp" phone={trial.phone}>
              <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp ({trial.whatsAppCount || 0})
            </ContactButton>
            {trial.location && (
                <Button variant="outline" size="sm" asChild>
                    <Link href={trial.location} target="_blank">
                    <MapPin className="mr-2 h-4 w-4" /> Map
                    </Link>
                </Button>
            )}
            <LeadHistoryDialog lead={{...trial, leadType: 'Free Trial'}} />
        </div>
      </CardContent>
    </Card>
  );
}

export default async function FreeTrialsPage() {
  const freeTrials = await getFreeTrials();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Free Trials</CardTitle>
            <BackButton />
        </div>
        <CardDescription>
          Users who have signed up for a free trial.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block">
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
                    <div>
                      <a
                        href={`mailto:${trial.email}`}
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                       <Mail className="h-3 w-3" /> {trial.email}
                      </a>
                    </div>
                    <div>
                      <a
                        href={`tel:${trial.phone}`}
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" /> {trial.phone}
                      </a>
                    </div>
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
                    <ContactButton leadId={trial._id} leadType="Free Trial" contactMethod="Call" phone={trial.phone}>
                      <Phone className="mr-2 h-4 w-4" /> Call ({trial.callCount || 0})
                    </ContactButton>
                    <ContactButton leadId={trial._id} leadType="Free Trial" contactMethod="WhatsApp" phone={trial.phone}>
                      <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp ({trial.whatsAppCount || 0})
                    </ContactButton>
                    {trial.location && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={trial.location} target="_blank">
                          <MapPin className="mr-2 h-4 w-4" /> Map
                        </Link>
                      </Button>
                    )}
                    <LeadHistoryDialog lead={{ ...trial, leadType: 'Free Trial' }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden space-y-4">
            {freeTrials.map((trial) => (
                <FreeTrialCard key={trial._id} trial={trial} />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
