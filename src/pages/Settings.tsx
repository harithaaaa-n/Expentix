import ProfileForm from "@/components/ProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BudgetManager from "@/components/BudgetManager";
import { ThemeToggle } from "@/components/ThemeToggle";
import AccountManagement from "@/components/AccountManagement";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal details and theme preference here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>

      {/* Monthly Budget Setup */}
      <BudgetManager />

      {/* Account Management */}
      <AccountManagement />
    </div>
  );
};

export default Settings;