import React, { useState, useEffect } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { useSession } from '@/integrations/supabase/session-context';
import AvatarUploader from './AvatarUploader';
import { useTheme } from 'next-themes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the schema for the profile form
const ProfileSchema = z.object({
  first_name: z.string().max(50).optional(),
  last_name: z.string().max(50).optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
  profession: z.string().max(100).optional(),
  theme: z.enum(["light", "dark", "system"]), // Added theme field
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  profession: string | null;
  theme: "light" | "dark" | "system";
}

const ProfileForm: React.FC = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const { setTheme } = useTheme();
  const [initialProfile, setInitialProfile] = useState<ProfileFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      avatar_url: '',
      profession: '',
      theme: 'light', // Default theme
    },
  });

  const { setValue, watch } = form;
  const avatarUrl = watch('avatar_url');

  const fetchProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url, profession, theme')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found (new user)
      showError('Failed to fetch profile: ' + error.message);
    } else if (data) {
      const profileData: ProfileFormValues = {
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        avatar_url: data.avatar_url || '',
        profession: data.profession || '',
        theme: data.theme || 'light',
      };
      setInitialProfile(profileData);
      form.reset(profileData);
      setTheme(profileData.theme); // Apply theme on load
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user && !isSessionLoading) {
      fetchProfile();
    }
  }, [user, isSessionLoading]);

  const handleAvatarUpload = (url: string) => {
    setValue('avatar_url', url, { shouldValidate: true });
  };

  const handleAvatarRemove = () => {
    setValue('avatar_url', '', { shouldValidate: true });
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: data.first_name || null,
          last_name: data.last_name || null,
          avatar_url: data.avatar_url || null,
          profession: data.profession || null,
          theme: data.theme, // Save theme preference
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })
        .select();

      if (error) throw error;
      
      // Apply theme immediately after successful save
      setTheme(data.theme);
      
      showSuccess('Profile updated successfully!');
      fetchProfile(); 
    } catch (error: any) {
      showError('Failed to update profile: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const fallbackText = user?.email ? getInitials(user.email.split('@')[0]) : 'U';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        
        <AvatarUploader 
          initialUrl={avatarUrl || null}
          onUploadSuccess={handleAvatarUpload}
          onRemove={handleAvatarRemove}
          disabled={isSubmitting}
          uploadPath="profile"
          fallbackText={fallbackText}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Profession */}
        <FormField
          control={form.control}
          name="profession"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profession (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Software Engineer, Teacher, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Theme Selector */}
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme Preference</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Save Profile'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;