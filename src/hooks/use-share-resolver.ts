import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

const EDGE_FUNCTION_NAME = 'resolve-share-id';

export const useShareResolver = (shareId: string | null) => {
  return useQuery({
    queryKey: ['shareResolver', shareId],
    queryFn: async () => {
      if (!shareId) return null;

      const { data, error } = await supabase.functions.invoke<{ user_id: string }>(EDGE_FUNCTION_NAME, {
        body: JSON.stringify({ share_id: shareId }),
        method: 'POST',
      });

      if (error) {
        showError("Failed to resolve share link: " + error.message);
        throw new Error(error.message);
      }
      
      if (data?.user_id) {
        return data.user_id;
      }
      
      throw new Error("Invalid share ID.");
    },
    enabled: !!shareId,
    staleTime: Infinity, // Share ID resolution is static
    retry: false,
  });
};