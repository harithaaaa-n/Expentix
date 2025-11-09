import { z } from "zod";

export const IncomeSources = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
] as const;

export const IncomeSchema = z.object({
  id: z.string().optional(),
  source: z.enum(IncomeSources),
  amount: z.number().min(0.01, "Amount must be greater than zero"),
  date: z.date(),
  description: z.string().max(255).optional().nullable(),
  member_id: z.string().optional().nullable(), // New field
});

export type IncomeFormValues = z.infer<typeof IncomeSchema>;

export type Income = Omit<IncomeFormValues, 'date'> & {
  date: string; // Date string from DB
  user_id: string;
  created_at: string;
};