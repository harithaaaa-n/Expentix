import React from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotifications, Notification } from '@/hooks/use-notifications';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const NotificationItem: React.FC<{ notification: Notification, onRead: (id: string) => void }> = ({ notification, onRead }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.is_read) {
      onRead(notification.id);
    }
    if (notification.link_to) {
      navigate(notification.link_to);
    }
  };

  return (
    <div 
      className={cn(
        "flex items-start space-x-3 p-3 hover:bg-accent cursor-pointer",
        !notification.is_read && "bg-blue-50 dark:bg-blue-900/20"
      )}
      onClick={handleClick}
    >
      <div className="flex-shrink-0 mt-1">
        <div className={cn(
          "h-2 w-2 rounded-full",
          notification.is_read ? "bg-transparent" : "bg-blue-500"
        )} />
      </div>
      <div className="flex-1">
        <p className="text-sm">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="link" size="sm" className="h-auto p-0" onClick={markAllAsRead}>
              <Check className="h-3 w-3 mr-1" /> Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <p className="p-4 text-sm text-muted-foreground">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            notifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} onRead={markAsRead} />
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;