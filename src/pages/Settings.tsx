import DashboardLayout from "@/components/DashboardLayout";
import ProfileForm from "@/components/ProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BudgetManager from "@/components/BudgetManager";
import { ThemeToggle } from "@/components/ThemeToggle";
import AccountManagement from "@/components/AccountManagement";

const Settings = () => {
  return (
    <DashboardLayout>
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

        {/* Account Management */}
        <AccountManagement />
      </div>
    </DashboardLayout>
  );
};

export default Settings;