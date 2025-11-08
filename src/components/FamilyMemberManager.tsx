import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FamilyMember, FamilyMemberFormValues, FamilyMemberSchema } from '@/types/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, User, Trash2, Edit, Share2, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/integrations/supabase/session-context';
import { showError, showSuccess } from '@/utils/toast';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// --- Form Component ---
interface FamilyMemberFormProps {
  initialData?: FamilyMemberFormValues;
  onSubmit: (data: FamilyMemberFormValues) => void;
  isSubmitting: boolean;
}

const MemberForm: React.FC<FamilyMemberFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const form = useForm<FamilyMemberFormValues>({
    resolver: zodResolver(FamilyMemberSchema),
    defaultValues: initialData || {
      name: '',
      relation: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form.reset]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="relation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relation (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Spouse, Child" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : initialData ? (
            'Save Changes'
          ) : (
            'Add Member'
          )}
        </Button>
      </form>
    </Form>
  );
};

// --- Manager Component ---
const FamilyMemberManager: React.FC = () => {
  const { user } = useSession();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMemberFormValues | undefined>(undefined);

  const fetchMembers = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      showError('Failed to fetch family members: ' + error.message);
    } else {
      setMembers(data as FamilyMember[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchMembers();
    }
  }, [user]);

  const handleFormSubmit = async (data: FamilyMemberFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    const memberData = {
      ...data,
      user_id: user.id,
      // Ensure share_id is generated only if it's a new member or missing
      share_id: editingMember?.share_id || Math.random().toString(36).substring(2, 10).toUpperCase(), 
    };

    try {
      if (editingMember?.id) {
        // Update existing member
        const { error } = await supabase
          .from('family_members')
          .update(memberData)
          .eq('id', editingMember.id)
          .select();

        if (error) throw error;
        showSuccess('Family member updated successfully!');
      } else {
        // Add new member
        const { error } = await supabase
          .from('family_members')
          .insert(memberData)
          .select();

        if (error) throw error;
        showSuccess('Family member added successfully!');
      }
      
      await fetchMembers();
      setIsModalOpen(false);
      setEditingMember(undefined);
    } catch (error: any) {
      showError('Operation failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this family member?')) return;

    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccess('Family member deleted successfully!');
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (error: any) {
      showError('Deletion failed: ' + error.message);
    }
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingMember(undefined);
    setIsModalOpen(true);
  };
  
  const handleCopyLink = (shareId: string) => {
    const shareLink = `${window.location.origin}/share/${shareId}`;
    navigator.clipboard.writeText(shareLink);
    showSuccess("Share link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Family Members ({members.length})</CardTitle>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
            </DialogHeader>
            <MemberForm 
              initialData={editingMember} 
              onSubmit={handleFormSubmit} 
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="pt-4">
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">No family members added yet. Add members to generate a share link for them to view your finances.</p>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md border">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.relation || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCopyLink(member.share_id!)}
                        className="text-xs h-8 px-3"
                      >
                        <Share2 className="h-3 w-3 mr-1" /> Share Link
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy Read-Only Share Link</p>
                    </TooltipContent>
                  </Tooltip>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id!)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FamilyMemberManager;