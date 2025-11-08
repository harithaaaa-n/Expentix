import DashboardLayout from "@/components/DashboardLayout";
import ProfileForm from "@/components/ProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FamilyMemberManager from "@/components/FamilyMemberManager";
import BudgetManager from "@/components/BudgetManager";
import { ThemeToggle } from "@/components/ThemeToggle";

const Settings = () => {
  // totalBalance is required by DashboardLayout, but we don't need real data here.
  const totalBalance = 0; 

  return (
    <DashboardLayout totalBalance={totalBalance}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>

        {/* Monthly Budget Setup */}
        <BudgetManager />

        {/* Family Member Management */}
        <FamilyMemberManager />

        {/* Theme Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Toggle between light and dark themes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Current Theme</p>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Account Management Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
            <CardDescription>
              Future settings like password change or account deletion will go here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              More account settings coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;