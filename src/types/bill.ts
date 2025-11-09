import { z } from "zod";

export const BillCategories = [
  "Rent/Mortgage",
  "Electricity",
  "Water",
  "Gas",
  "Internet/Phone",
  "Medical",
  "Grocery",
  "Fuel/Transport",
  "Education",
  "Other",
] as const;

export const RecurrenceTypes = [
  "Monthly",
  "Quarterly",
  "Annually",
  "One-time",
] as const;

export const PaymentStatuses = [
  "Pending",
  "Paid",
  "Overdue",
] as const;

export const BillSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  category: z.enum(BillCategories),
  amount: z.number().min(0.01, "Amount must be greater than zero"),
  due_date: z.date(),
  payment_status: z.enum(PaymentStatuses).default("Pending"),
  recurrence: z.enum(RecurrenceTypes).default("Monthly"),
  last_paid_date: z.date().optional().nullable(),
  bill_url: z.string().url().optional().or(z.literal('')).nullable(),
  description: z.string().max(255).optional().nullable(),
});

export type BillFormValues = z.infer<typeof BillSchema>;

export type Bill = Omit<BillFormValues, 'due_date' | 'last_paid_date' | 'amount'> & {
  due_date: string; // Date string from DB
  last_paid_date: string | null; // Date string from DB
  amount: number; // Numeric from DB
  user_id: string;
  created_at: string;
};