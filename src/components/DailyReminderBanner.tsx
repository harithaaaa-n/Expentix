import React from 'react';
import { useDailyReminder } from '@/hooks/use-daily-reminder';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DailyReminderBanner: React.FC = () => {
  const { needsReminder, isLoading, dismissReminder } = useDailyReminder();

  if (isLoading || !needsReminder) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Alert className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/30 p-4 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <AlertTitle className="text-blue-700 dark:text-blue-300">Daily Reminder</AlertTitle>
              <AlertDescription className="text-blue-600 dark:text-blue-400">
                Haven't logged your expenses today? Keep your records accurate!
              </AlertDescription>
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
            <Link to="/expenses/add">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                Log Expense
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={dismissReminder} title="Dismiss for today">
              <X className="h-4 w-4 text-blue-500" />
            </Button>
          </div>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
};

export default DailyReminderBanner;