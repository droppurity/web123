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
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {freeTrials.map((trial: FreeTrial) => (
              <TableRow key={trial._id}>
                <TableCell className="font-medium">{trial.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{trial.plan}</Badge>
                </TableCell>
                <TableCell>{trial.startDate.toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {trial.endDate.toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
