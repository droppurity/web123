import { getReferrals } from '@/lib/data';
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
import { Referral } from '@/types';
import { BackButton } from '@/components/back-button';

function getStatusVariant(status: Referral['status']) {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Expired':
      return 'destructive';
    default:
      return 'outline';
  }
}

function ReferralCard({ referral }: { referral: Referral }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
            <div>
                 <p className="font-semibold">{referral.referredEmail}</p>
                 <p className="text-sm text-muted-foreground">Referred by: {referral.referrerEmail}</p>
            </div>
            <Badge variant={getStatusVariant(referral.status)}>
                {referral.status}
            </Badge>
        </div>
         <div className="text-sm text-muted-foreground">
          Date: {referral.createdAt.toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ReferralsPage() {
  const referrals = await getReferrals();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Referrals</CardTitle>
            <BackButton />
        </div>
        <CardDescription>
          User referrals and their current status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referrer Email</TableHead>
                <TableHead>Referred Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral: Referral) => (
                <TableRow key={referral._id}>
                  <TableCell className="font-medium">
                    {referral.referrerEmail}
                  </TableCell>
                  <TableCell>{referral.referredEmail}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(referral.status)}>
                      {referral.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {referral.createdAt.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
         <div className="md:hidden space-y-4">
          {referrals.map((referral) => (
            <ReferralCard key={referral._id} referral={referral} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
