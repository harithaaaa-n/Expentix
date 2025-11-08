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
  description: z.string().max(255).optional(),
});

export type Income = z.infer<typeof IncomeSchema> & {
  user_id: string;
  created_at: string;
};

export type IncomeFormValues = z.infer<typeof IncomeSchema>;