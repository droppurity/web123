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

function getStatusVariant(status: Subscription['status']) {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Canceled':
      return 'secondary';
    case 'Past Due':
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
              <TableHead>User Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub: Subscription) => (
              <TableRow key={sub._id}>
                <TableCell className="font-medium">{sub.userEmail}</TableCell>
                <TableCell>
                  <Badge variant="outline">{sub.plan}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(sub.status)}>
                    {sub.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(sub.startDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'Active'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
