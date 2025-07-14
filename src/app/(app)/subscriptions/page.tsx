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
import { MapPin } from 'lucide-react';

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
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Purifier</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Tenure</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub: Subscription) => (
              <TableRow key={sub._id}>
                <TableCell className="font-medium">{sub.name}</TableCell>
                <TableCell>{sub.email}</TableCell>
                <TableCell>{sub.phone}</TableCell>
                <TableCell>{sub.address}</TableCell>
                <TableCell>{sub.purifierName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{sub.planName}</Badge>
                </TableCell>
                <TableCell>{sub.tenure}</TableCell>
                <TableCell>
                  {sub.location ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={sub.location} target="_blank">
                        <MapPin className="mr-2 h-4 w-4" /> View Map
                      </Link>
                    </Button>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {sub.createdAt
                    ? new Date(sub.createdAt).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
