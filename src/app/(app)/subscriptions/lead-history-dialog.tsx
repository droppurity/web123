'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Lead, LeadStatus, Interaction } from '@/types';
import { History, Phone, MessageSquare, PlusCircle } from 'lucide-react';
import { addInteraction, updateLeadStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: '',
};

function LeadManagementForms({
  lead,
  currentStatus,
  setCurrentStatus,
}: {
  lead: Lead;
  currentStatus: LeadStatus;
  setCurrentStatus: (status: LeadStatus) => void;
}) {
  const [addInteractionState, addInteractionAction] = useActionState(addInteraction, initialState);
  const [updateStatusState, updateStatusAction] = useActionState(updateLeadStatus, initialState);
  const { toast } = useToast();
  const addFormRef = useRef<HTMLFormElement>(null);
  const updateFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (addInteractionState.message) {
      toast({ title: 'Interaction', description: addInteractionState.message });
      if (addInteractionState.message.includes('success')) {
        addFormRef.current?.reset();
      }
    }
  }, [addInteractionState, toast]);

  useEffect(() => {
    if (updateStatusState.message) {
      toast({ title: 'Status Update', description: updateStatusState.message });
      if (updateStatusState.message.includes('success')) {
        const newStatus = (document.getElementById(`status-select-${lead._id}`) as HTMLInputElement)?.value as LeadStatus;
        if (newStatus) setCurrentStatus(newStatus);
        updateFormRef.current?.reset();
      }
    }
  }, [updateStatusState, toast, lead._id, setCurrentStatus]);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <h4 className="font-semibold mb-2">Add New Interaction</h4>
         <form ref={addFormRef} action={addInteractionAction} className="space-y-4">
            <input type="hidden" name="leadId" value={lead._id} />
            <input type="hidden" name="leadType" value={lead.leadType} />
            <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" required placeholder="Add conversation details..."/>
            </div>
             <div>
                <Label htmlFor="interactionType">Interaction Type</Label>
                <Select name="interactionType" defaultValue="Note">
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Note">Note</SelectItem>
                        <SelectItem value="Call">Call</SelectItem>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Interaction
            </Button>
        </form>
        
        <hr className="my-6" />

        <h4 className="font-semibold mb-2">Update Status</h4>
         <form ref={updateFormRef} action={updateStatusAction} className="space-y-4">
            <input type="hidden" name="leadId" value={lead._id} />
            <input type="hidden" name="leadType" value={lead.leadType} />
             <div>
                <Label htmlFor={`status-select-${lead._id}`}>Status</Label>
                <Select name="status" defaultValue={currentStatus}>
                    <SelectTrigger id={`status-select-${lead._id}`}>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Converted">Converted</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div>
                <Label htmlFor="reason">Reason (if Closed)</Label>
                <Textarea id="reason" name="reason" placeholder="Reason for closing the lead..."/>
            </div>
            <Button type="submit">Update Status</Button>
        </form>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Past Interactions</h4>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {lead.interactions && lead.interactions.length > 0 ? (
                lead.interactions.slice().reverse().map((interaction: Interaction) => (
                    <div key={interaction._id} className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                            <div className="font-semibold flex items-center gap-2">
                                {interaction.type === 'Call' && <Phone className="h-4 w-4" />}
                                {interaction.type === 'WhatsApp' && <MessageSquare className="h-4 w-4" />}
                                {interaction.type}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {new Date(interaction.createdAt).toLocaleString()}
                            </div>
                        </div>
                        <p className="text-sm">{interaction.notes}</p>
                    </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground">No interactions yet.</p>
            )}
        </div>
      </div>
    </div>
  );
}

export function LeadHistoryDialog({
  lead,
}: {
  lead: Lead;
}) {
  const [open, setOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead.status || 'New');
  const [isOnLeadPage, setIsOnLeadPage] = useState(false);
  
  useEffect(() => {
    // This effect will only run on the client side
    if (typeof window !== 'undefined') {
        setIsOnLeadPage(window.location.pathname.includes('/leads/'));
    }
  }, []);

  if (isOnLeadPage) {
    return <LeadManagementForms lead={lead} currentStatus={currentStatus} setCurrentStatus={setCurrentStatus} />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="mr-2 h-4 w-4" /> History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Lead History: {lead.name}</DialogTitle>
          <DialogDescription>
            Track interactions and update status for this lead.
          </DialogDescription>
        </DialogHeader>
        <LeadManagementForms lead={lead} currentStatus={currentStatus} setCurrentStatus={setCurrentStatus} />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
