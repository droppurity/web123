import {
  getFreeTrials,
  getReferrals,
  getSubscriptions,
  getContacts,
} from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Clock3,
  Share2,
  CreditCard,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { Subscription, FreeTrial, Lead, LeadStatus } from '@/types';
import Link from 'next/link';

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

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
            <div>
                 <p className="font-semibold">{lead.name}</p>
                 <div className="flex items-center gap-2 mt-1">
                     <Badge variant={lead.leadType === 'Subscription' ? 'default' : 'secondary'}>
                        {lead.leadType}
                      </Badge>
                      <Badge variant={getStatusVariant(lead.status || 'New')}>
                        {lead.status || 'New'}
                      </Badge>
                 </div>
            </div>
            <Button asChild variant="outline" size="sm">
                <Link href={`/leads/${lead.leadType.replace(' ', '-')}-${lead._id}`}>
                  Manage <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Date: {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
        </div>
      </CardContent>
    </Card>
  );
}


export default async function DashboardPage() {
  const [contacts, freeTrials, referrals, subscriptions] = await Promise.all([
    getContacts(),
    getFreeTrials(),
    getReferrals(),
    getSubscriptions(),
  ]);

  const totalContacts = contacts.length;
  const totalFreeTrials = freeTrials.length;
  const totalReferrals = referrals.length;
  const totalSubscriptions = subscriptions.length;

  const activeSubscriptionLeads = subscriptions
    .filter(
      (sub) => (sub.status || 'New') === 'New' || sub.status === 'Contacted'
    )
    .map((sub) => ({ ...sub, leadType: 'Subscription' as const }));

  const activeFreeTrialLeads = freeTrials
    .filter(
      (trial) =>
        (trial.status || 'New') === 'New' || trial.status === 'Contacted'
    )
    .map((trial) => ({ ...trial, leadType: 'Free Trial' as const }));

  const activeLeads: Lead[] = [...activeSubscriptionLeads, ...activeFreeTrialLeads]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Free Trials
            </CardTitle>
            <Clock3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFreeTrials}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Referrals
            </CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReferrals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subscriptions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscriptions}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle>Active Leads</CardTitle>
              <CardDescription>
                Recent subscription and free trial leads that need attention.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/subscriptions">
                  View All Subscriptions <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/free-trials">
                  View All Free Trials <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeLeads.length > 0 ? (
                  activeLeads.map((lead: Lead) => (
                    <TableRow key={lead._id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            lead.leadType === 'Subscription'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {lead.leadType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(lead.status || 'New')}>
                          {lead.status || 'New'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {lead.createdAt
                          ? new Date(lead.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={`/leads/${lead.leadType.replace(' ', '-')}-${lead._id}`}
                          >
                            Manage Lead <ArrowUpRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No active leads right now.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden space-y-4">
             {activeLeads.length > 0 ? (
                activeLeads.map((lead) => <LeadCard key={lead._id} lead={lead} />)
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No active leads right now.
                </p>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
