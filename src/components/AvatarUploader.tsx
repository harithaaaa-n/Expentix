import React, { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload, User, X, RefreshCw } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { useSession } from '@/integrations/supabase/session-context';

interface AvatarUploaderProps {
  initialUrl: string | null;
  onUploadSuccess: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

const BUCKET_NAME = 'avatars';

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ initialUrl, onUploadSuccess, onRemove, disabled = false }) => {
  const { user } = useSession();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialUrl);

  React.useEffect(() => {
    setAvatarUrl(initialUrl);
  }, [initialUrl]);

  const uploadAvatar = useCallback(async (file: File) => {
    if (!user) {
      showError("User not authenticated.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      showError("File size exceeds 2MB limit.");
      return;
    }

    setUploading(true);

    try {
      // 1. Delete old avatar if it exists (optional, but good practice for cleanup)
      if (avatarUrl) {
        const path = avatarUrl.split(`${BUCKET_NAME}/`)[1];
        if (path) {
          // We don't wait for deletion error, as the file might not exist or path might be complex
          supabase.storage.from(BUCKET_NAME).remove([path]);
        }
      }

      // 2. Upload new file
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // 3. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        setAvatarUrl(publicUrlData.publicUrl);
        onUploadSuccess(publicUrlData.publicUrl);
        showSuccess("Avatar uploaded successfully!");
      } else {
        throw new Error("Failed to retrieve public URL.");
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      showError("Error uploading avatar: " + error.message);
    } finally {
      setUploading(false);
    }
  }, [user, avatarUrl, onUploadSuccess]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const handleRemove = () => {
    if (!user) return;
    
    // Clear URL in state and parent form
    setAvatarUrl(null);
    onRemove();
    
    // Attempt to delete file from storage
    if (initialUrl) {
      const path = initialUrl.split(`${BUCKET_NAME}/`)[1];
      if (path) {
        supabase.storage.from(BUCKET_NAME).remove([path])
          .then(() => showSuccess("Avatar removed."))
          .catch(error => console.error("Error deleting old avatar:", error));
      }
    }
  };
  
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const fallbackText = user?.email ? getInitials(user.email.split('@')[0]) : 'U';

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium leading-none">Profile Photo</label>
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20 border-2 border-primary/50">
          <AvatarImage src={avatarUrl || ''} alt="User Avatar" />
          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
            {fallbackText}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col space-y-2 flex-1">
          {avatarUrl ? (
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleRemove}
                disabled={disabled || uploading}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" /> Remove Photo
              </Button>
              <label htmlFor="avatar-upload-change" className="flex-1">
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm" 
                  disabled={disabled || uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" /> Change Photo
                    </>
                  )}
                </Button>
                <Input 
                  id="avatar-upload-change" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden"
                  disabled={disabled || uploading}
                />
              </label>
            </div>
          ) : (
            <label htmlFor="avatar-upload" className="w-full">
              <Button 
                type="button" 
                variant="default" 
                size="sm" 
                disabled={disabled || uploading}
                className="w-full"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" /> Upload Photo
                  </>
                )}
              </Button>
              <Input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden"
                disabled={disabled || uploading}
              />
            </label>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Max file size: 2MB. Recommended format: JPEG/PNG.</p>
    </div>
  );
};

export default AvatarUploader;