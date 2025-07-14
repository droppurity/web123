import { getContacts } from '@/lib/data';
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
import { Contact } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, MapPin } from 'lucide-react';

function ContactCard({ contact }: { contact: Contact }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">{contact.name}</p>
            <p className="text-sm text-muted-foreground">{contact.subject}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {contact.createdAt.toLocaleDateString()}
          </p>
        </div>
        <p className="text-sm">{contact.message}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <a href={`mailto:${contact.email}`}>
              <Mail className="mr-2 h-4 w-4" /> {contact.email}
            </a>
          </Button>
          {contact.mapLink && (
            <Button variant="outline" size="sm" asChild>
              <Link href={contact.mapLink} target="_blank">
                <MapPin className="mr-2 h-4 w-4" /> View Map
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
        <CardDescription>
          All contact form submissions from users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Map Link</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact: Contact) => (
                <TableRow key={contact._id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-primary hover:underline"
                    >
                      {contact.email}
                    </a>
                  </TableCell>
                  <TableCell>{contact.subject}</TableCell>
                  <TableCell
                    className="max-w-xs truncate"
                    title={contact.message}
                  >
                    {contact.message}
                  </TableCell>
                  <TableCell>
                    {contact.mapLink ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={contact.mapLink} target="_blank">
                          <MapPin className="mr-2 h-4 w-4" /> View Map
                        </Link>
                      </Button>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {contact.createdAt.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden space-y-4">
          {contacts.map((contact) => (
            <ContactCard key={contact._id} contact={contact} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
