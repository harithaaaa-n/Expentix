import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { EssentialBill, PaymentStatuses } from "@/types/bills";
import { format, startOfMonth, endOfMonth, isPast, isBefore, parseISO } from "date-fns";

const useEssentialBills = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const currentMonthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const lastMonthStart = format(startOfMonth(new Date(new Date().setMonth(new Date().getMonth() - 1))), 'yyyy-MM-dd');

  const queryKey = ['essentialBills', user?.id];

  const { data: bills, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('essential_bills')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (error) throw error;
      
      // Client-side logic to update status if overdue
      const today = new Date();
      return (data as EssentialBill[]).map(bill => {
        const dueDate = parseISO(bill.due_date);
        
        if (bill.payment_status === 'Pending' && isPast(dueDate) && isBefore(dueDate, today)) {
          // Mark as overdue if pending and due date is past
          // We explicitly cast the status to the correct enum type
          return { ...bill, payment_status: 'Overdue' as typeof PaymentStatuses[number] };
        }
        return bill;
      }) as EssentialBill[]; // Explicitly cast the final array type
    },
    enabled: !!user && !isSessionLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const summary = bills ? bills.reduce((acc, bill) => {
    const amount = bill.amount;
    
    if (bill.payment_status === 'Pending' || bill.payment_status === 'Overdue') {
      acc.pendingAmount += amount;
      acc.pendingCount += 1;
    } else if (bill.payment_status === 'Paid') {
      acc.paidAmount += amount;
    }
    
    // Simple trend analysis (Placeholder: needs more data history for real trend)
    // For now, we just calculate total monthly bills
    if (parseISO(bill.due_date) >= startOfMonth(new Date())) {
        acc.currentMonthTotal += amount;
    }

    return acc;
  }, { pendingAmount: 0, paidAmount: 0, pendingCount: 0, currentMonthTotal: 0 }) : { pendingAmount: 0, paidAmount: 0, pendingCount: 0, currentMonthTotal: 0 };

  return {
    bills: bills || [],
    summary,
    isLoading: isLoading || isSessionLoading,
    refetch,
  };
};

export { useEssentialBills };