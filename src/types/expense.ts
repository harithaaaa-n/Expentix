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
  "Bank Transfer",
  "Other",
] as const;

export const ExpenseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  amount: z.number().min(0.01, "Amount must be greater than zero"),
  category: z.enum(ExpenseCategories),
  expense_date: z.date(),
  payment_type: z.enum(PaymentTypes).optional(),
  description: z.string().max(255).optional(),
  receipt_url: z.string().optional().nullable(),
});

export type Expense = z.infer<typeof ExpenseSchema> & {
  user_id: string;
  created_at: string;
};

export type ExpenseFormValues = z.infer<typeof ExpenseSchema>;