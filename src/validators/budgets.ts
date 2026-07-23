import { z } from "zod";

export const createBudgetSchema = z.object({
  body: z.object({
    categoryId: z.uuid(),
    amount: z.number().positive(),
    month: z.number().min(1).max(12),
    year: z.number().min(1900).max(3000),
  }),
});

export const getBudgetsQuerySchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1900).max(3000),
});

export const updateBudgetSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
  }),
});

export type CreateBudgetBody = z.infer<typeof createBudgetSchema>["body"];
export type UpdateBudgetBody = z.infer<typeof updateBudgetSchema>["body"];
