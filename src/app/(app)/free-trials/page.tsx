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
import { FreeTrial } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

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
            {freeTrials.map((trial: FreeTrial) => (
              <TableRow key={trial._id}>
                <TableCell className="font-medium">{trial.name}</TableCell>
                <TableCell>{trial.email}</TableCell>
                <TableCell>{trial.phone}</TableCell>
                <TableCell>{trial.address}</TableCell>
                <TableCell>{trial.purifierName}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{trial.planName}</Badge>
                </TableCell>
                <TableCell>{trial.tenure}</TableCell>
                <TableCell>
                  {trial.location ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={trial.location} target="_blank">
                        <MapPin className="mr-2 h-4 w-4" /> View Map
                      </Link>
                    </Button>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {trial.createdAt
                    ? new Date(trial.createdAt).toLocaleDateString()
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
