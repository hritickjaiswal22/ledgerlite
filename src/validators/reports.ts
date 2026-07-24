import { z } from "zod";

export const getMonthSummaryQuerySchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1900).max(3000),
});

export const getCategoriesSummaryQuerySchema = getMonthSummaryQuerySchema
  .clone()
  .extend({
    type: z.enum(["income", "expense"]),
  });

export const getBudgetSummaryQuerySchema = getMonthSummaryQuerySchema.clone();
