import {
  getContacts,
  getFreeTrials,
  getReferrals,
  getSubscriptions,
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
import { Users, Clock3, Share2, CreditCard, ArrowRight } from 'lucide-react';
import { Subscription } from '@/types';
import Link from 'next/link';
import { LeadHistoryDialog } from '../subscriptions/lead-history-dialog';

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

  const activeLeads = subscriptions
    .filter((sub) => sub.status === 'New' || sub.status === 'Contacted')
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Active Leads</CardTitle>
              <CardDescription>
                Recent subscription leads that need attention.
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/subscriptions">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeLeads.length > 0 ? (
                activeLeads.map((sub: Subscription) => (
                  <TableRow key={sub._id}>
                    <TableCell className="font-medium">{sub.name}</TableCell>
                    <TableCell>
                      <div>{sub.email}</div>
                      <div>{sub.phone}</div>
                    </TableCell>
                    <TableCell>{sub.planName}</TableCell>
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
                    <TableCell>
                      <LeadHistoryDialog subscription={sub} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No active leads right now.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
