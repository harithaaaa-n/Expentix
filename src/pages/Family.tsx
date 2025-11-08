import DashboardLayout from "@/components/DashboardLayout";
import FamilyMemberManager from "@/components/FamilyMemberManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Trophy, Activity } from "lucide-react";

const FamilyPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">👨‍👩‍👧 Family Finance Hub</h1>
        
        {/* Family Member Management */}
        <FamilyMemberManager />

        {/* Placeholder for Combined Spending Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-primary" />
              Combined Spending Overview
            </CardTitle>
            <CardDescription>
              A complete view of your family's finances. Coming soon!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This section will feature charts and stats for your family's combined income and expenses.
            </p>
          </CardContent>
        </Card>

        {/* Placeholder for Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
              Monthly Leaderboard
            </CardTitle>
            <CardDescription>
              A fun way to encourage good financial habits. Coming soon!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              See who is the "Top Saver" or "Most Diligent Tracker" for the month.
            </p>
          </CardContent>
        </Card>
        
        {/* Placeholder for Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-green-500" />
              Family Activity Feed
            </CardTitle>
            <CardDescription>
              Keep track of financial events in real-time. Coming soon!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This feed will show when members add or update expenses and income.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FamilyPage;