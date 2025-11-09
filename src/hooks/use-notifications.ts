import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/integrations/supabase/session-context';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface Notification {
  id: string;
  message: string;
  type: string;
  is_read: boolean;
  link_to: string | null;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20); // Limit to 20 notifications

    if (error) {
      console.error("Error fetching notifications:", error);
    } else {
      setNotifications(data as Notification[]);
      const unread = data.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    }
    setIsLoading(false);
  }, [user]);

  // Effect to trigger notification generation once per day
  useEffect(() => {
    if (!user) return;

    const lastCheckKey = `last_notification_check_${user.id}`;
    const lastCheck = localStorage.getItem(lastCheckKey);
    const today = new Date().toISOString().split('T')[0];

    if (lastCheck !== today) {
      console.log("Generating notifications for today...");
      supabase.rpc('generate_overdue_bill_notifications').then(({ error }) => {
        if (error) {
          console.error("Error generating notifications:", error);
        } else {
          localStorage.setItem(lastCheckKey, today);
          fetchNotifications(); // Refetch after generating
        }
      });
    }
  }, [user, fetchNotifications]);


  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRealtimeUpdate = useCallback((payload: RealtimePostgresChangesPayload<Notification>) => {
    // Refetch all to ensure order and counts are correct
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications-channel')
      .on<Notification>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        handleRealtimeUpdate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, handleRealtimeUpdate]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) {
      console.error("Error marking notification as read:", error);
    }
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? {...n, is_read: true} : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error("Error marking all notifications as read:", error);
    }
    // Optimistic update
    setNotifications(prev => prev.map(n => ({...n, is_read: true})));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, isLoading, markAsRead, markAllAsRead };
};