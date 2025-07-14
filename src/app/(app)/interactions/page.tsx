import { getAllInteractions } from '@/lib/data';
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
import type { Interaction } from '@/types';
import { Phone, MessageSquare, StickyNote } from 'lucide-react';
import Link from 'next/link';
import { BackButton } from '@/components/back-button';

function InteractionIcon({ type }: { type: Interaction['type'] }) {
  switch (type) {
    case 'Call':
      return <Phone className="h-4 w-4" />;
    case 'WhatsApp':
      return <MessageSquare className="h-4 w-4" />;
    case 'Note':
      return <StickyNote className="h-4 w-4" />;
    default:
      return null;
  }
}

function InteractionCard({ interaction }: { interaction: Interaction }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link
              href={`/leads/${interaction.leadType.replace(' ', '-')}-${interaction.leadId}`}
              className="font-semibold hover:underline"
            >
              {interaction.leadName}
            </Link>
            <p className="text-sm text-muted-foreground">{interaction.leadType}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <InteractionIcon type={interaction.type} />
              <p className="font-medium">{interaction.type}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(interaction.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <p className="text-sm bg-muted p-3 rounded-md">{interaction.notes}</p>
      </CardContent>
    </Card>
  );
}

export default async function InteractionsPage() {
  const interactions = await getAllInteractions();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>All Interactions</CardTitle>
            <BackButton />
        </div>
        <CardDescription>
          A chronological log of all lead interactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Name</TableHead>
                <TableHead>Lead Type</TableHead>
                <TableHead>Interaction Type</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interactions.map((interaction: Interaction) => (
                <TableRow key={interaction._id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/leads/${interaction.leadType.replace(' ', '-')}-${interaction.leadId}`}
                      className="hover:underline"
                    >
                      {interaction.leadName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={interaction.leadType === 'Subscription' ? 'default' : 'secondary'}>
                      {interaction.leadType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <InteractionIcon type={interaction.type} />
                      {interaction.type}
                    </div>
                  </TableCell>
                  <TableCell
                    className="max-w-md truncate"
                    title={interaction.notes}
                  >
                    {interaction.notes}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(interaction.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden space-y-4">
          {interactions.map(interaction => (
            <InteractionCard key={interaction._id} interaction={interaction} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
