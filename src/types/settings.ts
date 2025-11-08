import { z } from "zod";
import { ExpenseCategories } from "./expense";

// --- Family Member Types ---
export const FamilyMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  relation: z.string().optional(),
  share_id: z.string().optional(),
});

export type FamilyMember = z.infer<typeof FamilyMemberSchema> & {
  user_id: string;
  created_at: string;
};

export type FamilyMemberFormValues = z.infer<typeof FamilyMemberSchema>;


// --- Budget Types ---
export const BudgetSchema = z.object({
  id: z.string().optional(),
  category: z.enum(ExpenseCategories),
  amount: z.number().min(0.01, "Amount must be greater than zero"),
  month: z.date(), // Date object for form validation
});

export type BudgetFormValues = z.infer<typeof BudgetSchema>;

// Type for data fetched directly from Supabase (where month is string)
export type Budget = Omit<z.infer<typeof BudgetSchema>, 'month'> & {
  month: string; // Date string from DB
  user_id: string;
  created_at: string;
};