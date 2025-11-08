import { z } from "zod";

export const ExpenseCategories = [
  "Food",
  "Housing",
  "Transport",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Personal",
  "Other",
] as const;

export const PaymentTypes = [
  "Credit Card",
  "Debit Card",
  "Cash",
  "UPI/Digital Wallet",
  "Bank Transfer",
] as const;

export const ExpenseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  amount: z.number().min(0.01, "Amount must be greater than zero"),
  category: z.enum(ExpenseCategories),
  expense_date: z.date(),
  payment_type: z.enum(PaymentTypes).optional().nullable(),
  description: z.string().max(255).optional().nullable(),
  receipt_url: z.string().url().optional().or(z.literal('')).nullable(),
});

export type ExpenseFormValues = z.infer<typeof ExpenseSchema>;

export type Expense = Omit<ExpenseFormValues, 'expense_date' | 'amount'> & {
  expense_date: string; // Date string from DB
  amount: number; // Amount is numeric from DB
  user_id: string;
  created_at: string;
};