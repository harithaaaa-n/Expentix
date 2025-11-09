import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ExpenseManagement from "./pages/ExpenseManagement";
import IncomeManagement from "./pages/IncomeManagement";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import FamilyPage from "./pages/Family";
import SharedDashboard from "./pages/SharedDashboard";
import BillManagement from "./pages/BillManagement";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { SessionContextProvider } from "./integrations/supabase/session-context";
import { ThemeProvider } from "./components/ThemeProvider";
import { useInitialTheme } from "./hooks/use-initial-theme";
import ProtectedLayout from "./components/ProtectedLayout";

const queryClient = new QueryClient();

// Component to wrap routes and apply initial theme
const ThemeInitializer = ({ children }: { children: React.ReactNode }) => {
  useInitialTheme();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <ThemeInitializer>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/share/:shareId" element={<SharedDashboard />} />

                {/* Protected Routes (Dashboard Layout Applied Here) */}
                <Route element={<ProtectedLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/expenses" element={<ExpenseManagement />} />
                  <Route path="/income" element={<IncomeManagement />} />
                  <Route path="/bills" element={<BillManagement />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/family" element={<FamilyPage />} />
                </Route>

                {/* Catch-all Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeInitializer>
      </ThemeProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;