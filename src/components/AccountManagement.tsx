import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

// --- Password Change Form ---
const PasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long."),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof PasswordSchema>;

const PasswordChangeForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: data.password });
      if (error) throw error;
      showSuccess("Password updated successfully!");
      form.reset();
    } catch (error: any) {
      showError("Failed to update password: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Change Password
        </Button>
      </form>
    </Form>
  );
};

// --- Account Deletion ---
const AccountDeletion: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        method: 'POST',
      });
      if (error) throw error;
      
      showSuccess("Account deleted successfully. You will be logged out.");
      await supabase.auth.signOut();
      navigate('/');

    } catch (error: any) {
      showError("Failed to delete account: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10">
      <h3 className="font-semibold text-destructive">Danger Zone</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        Deleting your account is permanent and cannot be undone. All your data will be removed.
      </p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete My Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Yes, delete my account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// --- Main Component ---
const AccountManagement: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Management</CardTitle>
        <CardDescription>
          Manage your password and account settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <PasswordChangeForm />
        <AccountDeletion />
      </CardContent>
    </Card>
  );
};

export default AccountManagement;