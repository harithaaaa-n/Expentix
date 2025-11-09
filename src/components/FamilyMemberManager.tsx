import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FamilyMember, FamilyMemberFormValues, FamilyMemberSchema } from '@/types/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Trash2, Edit, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/integrations/supabase/session-context';
import { showError, showSuccess } from '@/utils/toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AvatarUploader from './AvatarUploader';
import { v4 as uuidv4 } from 'uuid';

// --- Form Component ---
interface FamilyMemberFormProps {
  initialData?: FamilyMemberFormValues;
  onSubmit: (data: FamilyMemberFormValues) => void;
  isSubmitting: boolean;
}

export const MemberForm: React.FC<FamilyMemberFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const form = useForm<FamilyMemberFormValues>({
    resolver: zodResolver(FamilyMemberSchema),
    defaultValues: initialData || {
      id: uuidv4(), // Pre-generate ID for new members
      name: '',
      relation: '',
      email: '',
      avatar_url: '',
    },
  });

  const { setValue, watch } = form;
  const avatarUrl = watch('avatar_url');
  const memberId = watch('id');

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form.reset]);

  const handleAvatarUpload = (url: string) => {
    setValue('avatar_url', url, { shouldValidate: true });
  };

  const handleAvatarRemove = () => {
    setValue('avatar_url', '', { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AvatarUploader
          initialUrl={avatarUrl || null}
          onUploadSuccess={handleAvatarUpload}
          onRemove={handleAvatarRemove}
          disabled={isSubmitting}
          uploadPath={`family_members/${memberId}`}
          fallbackText={form.getValues('name')?.substring(0, 2).toUpperCase() || 'FM'}
        />
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Optional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., jane@example.com" {...field} />
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
interface FamilyMemberListProps {
  members: FamilyMember[];
  isLoading: boolean;
  onEdit: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
}

const FamilyMemberList: React.FC<FamilyMemberListProps> = ({ members, isLoading, onEdit, onDelete }) => {
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  
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
      <CardHeader>
        <CardTitle className="text-lg">Manage Family Members ({members.length})</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">No family members added yet. Use the 'Add Member' button above to get started.</p>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md border">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={member.avatar_url || ''} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.relation || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
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
                  </TooltipProvider>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(member)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(member.id!)}>
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

export default FamilyMemberList;