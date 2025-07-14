'use client';

import { Button } from '@/components/ui/button';
import { logContactAttempt } from '@/lib/actions';

interface ContactButtonProps {
  leadId: string;
  leadType: string;
  contactMethod: 'Call' | 'WhatsApp';
  phone: string;
  children: React.ReactNode;
}

export function ContactButton({ leadId, leadType, contactMethod, phone, children }: ContactButtonProps) {
  const handleClick = async () => {
    await logContactAttempt(leadId, leadType, contactMethod);
    if (contactMethod === 'Call') {
      window.location.href = `tel:${phone}`;
    } else {
      window.open(`https://wa.me/${phone}`, '_blank');
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick} className='flex-1 md:flex-none'>
      {children}
    </Button>
  );
}
