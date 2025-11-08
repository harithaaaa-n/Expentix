import DashboardLayout from "@/components/DashboardLayout";
import FamilyMemberList, { MemberForm } from "@/components/FamilyMemberManager";
import FamilyMemberCard from "@/components/FamilyMemberCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Trophy, Activity, Plus, DollarSign, LayoutDashboard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSession } from "@/integrations/supabase/session-context";
import { supabase } from "@/integrations/supabase/client";
import { FamilyMember, FamilyMemberFormValues } from "@/types/settings";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "@/utils/toast";

const FamilyPage = () => {
  const { user } = useSession();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMemberFormValues | undefined>(undefined);

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

  const handleFormSubmit = async (data: FamilyMemberFormValues) => {
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
      setIsModalOpen(false);
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
    } catch (error: any) {
      showError('Deletion failed: ' + error.message);
    }
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingMember(undefined);
    setIsModalOpen(true);
  };

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
            
            {/* Add Member Button (Functional) */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" /> Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
                </DialogHeader>
                <MemberForm 
                  initialData={editingMember} 
                  onSubmit={handleFormSubmit} 
                  isSubmitting={isSubmitting}
                />
              </DialogContent>
            </Dialog>

            {/* Add Transaction Button (Functional) */}
            <Link to="/expenses">
              <Button variant="outline">
                <DollarSign className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </Link>
            
            {/* View Family Summary Button (Functional - links to Dashboard) */}
            <Link to="/dashboard">
              <Button variant="outline">
                <LayoutDashboard className="mr-2 h-4 w-4" /> View Family Summary
              </Button>
            </Link>
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
                No family members added yet. Use the 'Add Member' button above to get started.
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

        {/* Family Member Management List */}
        <FamilyMemberList 
          members={members} 
          isLoading={isLoading} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />

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