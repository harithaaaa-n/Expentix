import FamilyMemberList, { MemberForm } from "@/components/FamilyMemberManager";
import FamilyMemberCard from "@/components/FamilyMemberCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Activity, Plus, DollarSign, LayoutDashboard, Loader2, Users, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSession } from "@/integrations/supabase/session-context";
import { supabase } from "@/integrations/supabase/client";
import { FamilyMember, FamilyMemberFormValues } from "@/types/settings";
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "@/utils/toast";
import { useOwnerProfile } from "@/hooks/use-owner-profile";
import MemberTransactionForm from "@/components/MemberTransactionForm";
import { useFinancialSummary } from "@/hooks/use-financial-summary";
import CategoryPieChart from "@/components/CategoryPieChart";
import MonthlyExpenseChart from "@/components/MonthlyExpenseChart";
import { BarChart } from "recharts";
import LeaderboardCard from "@/components/LeaderboardCard"; // Import the new component
import ActivityFeedCard from "@/components/ActivityFeedCard"; // Import the new component
import { Helmet } from "react-helmet-async";

// Placeholder for Member Expense Comparison Chart
const MemberExpenseComparisonChart: React.FC<{ members: FamilyMember[], ownerId: string, ownerName: string }> = ({ members, ownerId, ownerName }) => {
  // NOTE: In a real app, we would fetch aggregated data for all members here.
  // For now, we use mock data based on member names.
  const chartData = [
    { name: ownerName, expenses: 35000 },
    ...members.map(m => ({
      name: m.name.split(' ')[0],
      expenses: 10000 + Math.floor(Math.random() * 20000)
    }))
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Expense Comparison</CardTitle>
        <CardDescription>Monthly spending comparison across all family members.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] p-2 md:p-6">
        <MonthlyExpenseChart data={chartData.map(d => ({ month: d.name, expenses: d.expenses }))} />
      </CardContent>
    </Card>
  );
};

const FamilyPage = () => {
  const { user } = useSession();
  const { data: ownerProfileData, isLoading: isProfileLoading } = useOwnerProfile();
  
  // Fetch combined summary for the whole family (memberId is undefined)
  const { 
    currentMonthCategoryExpenses, 
    refetch: refetchSummary 
  } = useFinancialSummary(); 

  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMemberFormValues | undefined>(undefined);

  const ownerName = ownerProfileData?.ownerName || 'You';
  const ownerId = user?.id || '';

  const fetchMembers = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMembers();
    }
  }, [user, fetchMembers]);

  const handleMemberFormSubmit = async (data: FamilyMemberFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    const memberData = {
      ...data,
      user_id: user.id,
      share_id: editingMember?.share_id || Math.random().toString(36).substring(2, 10).toUpperCase(), 
    };

    try {
      if (editingMember?.id) {
        const { error } = await supabase.from('family_members').update(memberData).eq('id', editingMember.id);
        if (error) throw error;
        showSuccess('Family member updated successfully!');
      } else {
        const { error } = await supabase.from('family_members').insert(memberData);
        if (error) throw error;
        showSuccess('Family member added successfully!');
      }
      
      await fetchMembers();
      setIsMemberModalOpen(false);
      setEditingMember(undefined);
    } catch (error: any) {
      showError('Operation failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this family member?')) return;

    try {
      const { error } = await supabase.from('family_members').delete().eq('id', id);
      if (error) throw error;
      showSuccess('Family member deleted successfully!');
      setMembers(prev => prev.filter(m => m.id !== id));
      refetchSummary(); // Refetch overall summary after deletion
    } catch (error: any) {
      showError('Deletion failed: ' + error.message);
    }
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setIsMemberModalOpen(true);
  };

  const handleAddMember = () => {
    setEditingMember(undefined);
    setIsMemberModalOpen(true);
  };
  
  const handleTransactionSuccess = () => {
    refetchSummary(); // Refetch overall summary after transaction
    fetchMembers(); // Refetch member data to update cards
  };

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Family Center — Expentix</title>
        <meta name="description" content="Manage family members, track individual spending, and view combined analytics." />
      </Helmet>
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">👨‍👩‍👧 Family Finance Center</h1>
          <p className="text-muted-foreground">Track, share, and grow together as a family 💫</p>
        </div>
        <div className="flex space-x-3 self-start md:self-center">
          
          {/* Add Member Button */}
          <Dialog open={isMemberModalOpen} onOpenChange={setIsMemberModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={handleAddMember}>
                <Plus className="mr-2 h-4 w-4" /> Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
              </DialogHeader>
              <MemberForm 
                initialData={editingMember} 
                onSubmit={handleMemberFormSubmit} 
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>

          {/* Add Transaction Button (Opens unified form) */}
          <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <DollarSign className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Log Family Transaction</DialogTitle>
              </DialogHeader>
              <MemberTransactionForm 
                members={members}
                ownerName={ownerName}
                ownerId={ownerId}
                onSuccess={() => {
                  setIsTransactionModalOpen(false);
                  handleTransactionSuccess();
                }}
              />
            </DialogContent>
          </Dialog>
          
          {/* View Family Summary Button (links to Dashboard) */}
          <Link to="/dashboard">
            <Button variant="outline">
              <LayoutDashboard className="mr-2 h-4 w-4" /> View Family Summary
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Individual Member Wallets (Cards) */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Member Wallets</CardTitle>
          <CardDescription>
            Track personal income, expenses, and budget progress for each member.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground border rounded-lg">
              No family members added yet. Use the 'Add Member' button above to get started.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <FamilyMemberCard 
                  key={member.id} 
                  member={member} 
                  ownerName={ownerName}
                  ownerId={ownerId}
                  allMembers={members}
                  onTransactionSuccess={handleTransactionSuccess}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Family Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Combined Family Analytics
          </CardTitle>
          <CardDescription>
            Visualizations of the entire family's financial health.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          {/* Combined Category Pie Chart */}
          <CategoryPieChart data={currentMonthCategoryExpenses} />
          
          {/* Member Expense Comparison Bar Chart */}
          <MemberExpenseComparisonChart members={members} ownerId={ownerId} ownerName={ownerName} />
        </CardContent>
      </Card>

      {/* Monthly Leaderboard */}
      <LeaderboardCard />

      {/* Family Member Management List */}
      <FamilyMemberList 
        members={members} 
        isLoading={isLoading} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {/* Activity Feed */}
      <ActivityFeedCard members={members} />
    </div>
  );
};

export default FamilyPage;