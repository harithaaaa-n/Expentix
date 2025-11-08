import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, X } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

interface ReceiptUploaderProps {
  onUploadSuccess: (url: string) => void;
  initialUrl?: string | null;
  disabled?: boolean;
}

const BUCKET_NAME = 'receipts';

const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({ onUploadSuccess, initialUrl, disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(initialUrl || null);

  React.useEffect(() => {
    setReceiptUrl(initialUrl || null);
  }, [initialUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showError("File size exceeds 5MB limit.");
      return;
    }

    setUploading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        showError("User not authenticated.");
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        setReceiptUrl(publicUrlData.publicUrl);
        onUploadSuccess(publicUrlData.publicUrl);
        showSuccess("Receipt uploaded successfully!");
      } else {
        throw new Error("Failed to retrieve public URL.");
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      showError("Error uploading receipt: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setReceiptUrl(null);
    onUploadSuccess(''); // Clear the URL in the parent form
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Bill Receipt (Optional)
      </label>
      {receiptUrl ? (
        <div className="flex items-center space-x-3 p-3 border rounded-md bg-muted/50">
          <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 truncate flex-1">
            View Uploaded Receipt
          </a>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Input 
            id="receipt" 
            type="file" 
            accept="image/*,application/pdf" 
            onChange={handleFileChange} 
            className="flex-1"
            disabled={uploading || disabled}
          />
          <Button 
            type="button" 
            disabled={uploading || disabled}
            className="w-24"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" /> Upload
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReceiptUploader;