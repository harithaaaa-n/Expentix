import DashboardLayout from "@/components/DashboardLayout";
import FamilyMemberManager from "@/components/FamilyMemberManager";
import FamilyMemberCard from "@/components/FamilyMemberCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Trophy, Activity, Plus, DollarSign, LayoutDashboard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSession } from "@/integrations/supabase/session-context";
import { supabase } from "@/integrations/supabase/client";
import { FamilyMember } from "@/types/settings";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { showError } from "@/utils/toast";

const FamilyPage = () => {
  const { user } = useSession();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMembers = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      showError('Failed to fetch family members: ' + error.message);
    } else {
      setMembers(data as FamilyMember[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchMembers();
    }
  }, [user]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">👨‍👩‍👧 Family Finance Center</h1>
            <p className="text-muted-foreground">Track, share, and grow together as a family 💫</p>
          </div>
          <div className="flex space-x-3 self-start md:self-center">
            <Link to="/expenses">
              <Button variant="outline">
                <DollarSign className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">
                <LayoutDashboard className="mr-2 h-4 w-4" /> View Family Summary
              </Button>
            </Link>
            {/* Add Member button is now inside FamilyMemberManager, but we can keep a trigger here if needed */}
          </div>
        </div>
        
        {/* Family Member Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Member Insights</CardTitle>
            <CardDescription>
              View spending summaries for each family member. (Note: Data shown is currently based on the owner's overall finances for demonstration.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground border rounded-lg">
                No family members added yet. Use the manager below to add members.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <FamilyMemberCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Family Member Management (Moved to bottom for cleaner layout) */}
        <FamilyMemberManager />

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