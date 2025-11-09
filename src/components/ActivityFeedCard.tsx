import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useRealtimeActivity } from '@/hooks/use-realtime-activity';
import { FamilyMember } from '@/types/settings';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ActivityFeedCardProps {
  members: FamilyMember[];
}

const ActivityFeedCard: React.FC<ActivityFeedCardProps> = ({ members }) => {
  // Map members to the format required by the hook (id and name)
  const memberMap = members.map(m => ({ id: m.id!, name: m.name }));
  const { activityFeed } = useRealtimeActivity(memberMap);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5 text-green-500" />
          Family Activity Feed
        </CardTitle>
        <CardDescription>
          Keep track of financial events in real-time (last 10 events).
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {activityFeed.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center p-6">
            No recent activity yet. Log an expense or income to see the feed update!
          </p>
        ) : (
          <div className="divide-y divide-border max-h-80 overflow-y-auto">
            <AnimatePresence initial={false}>
              {activityFeed.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start space-x-3 p-4 hover:bg-muted/50"
                >
                  {item.type === 'expense' ? (
                    <TrendingDown className="h-4 w-4 text-destructive flex-shrink-0 mt-1" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{item.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeedCard;