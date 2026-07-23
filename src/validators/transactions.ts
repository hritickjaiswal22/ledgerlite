import { z } from "zod";

const ALLOWED_LIMITS = [10, 20, 50] as const;

export const createTransactionSchema = z.object({
  body: z.object({
    accountId: z.uuid(),
    categoryId: z.uuid(),
    amount: z.number().positive(),
    type: z.enum(["income", "expense"]),
    transactionDate: z.coerce.date(),
    description: z.string().max(250).optional(),
  }),
});

export const getTransactionsQuerySchema = z
  .object({
    limit: z.coerce
      .number()
      .default(10)
      .refine(
        (value): value is (typeof ALLOWED_LIMITS)[number] =>
          ALLOWED_LIMITS.includes(value as (typeof ALLOWED_LIMITS)[number]),
        {
          message: "Limit must be one of 10, 20, or 50",
        },
      ),
    cursorId: z.uuid().optional(),
    cursorDate: z.coerce.date().optional(),
    accountId: z.uuid().optional(),
    categoryId: z.uuid().optional(),
    type: z.enum(["income", "expense"]).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      const hasStart = data.startDate !== undefined;
      const hasEnd = data.endDate !== undefined;

      // Either both exist or neither exists
      return (hasStart && hasEnd) || (!hasStart && !hasEnd);
    },
    {
      message: "Both startDate and endDate must be provided together",
      path: ["startDate"], // Attaches the validation error to startDate field in form errors
    },
  )
  .refine(
    (data) => {
      // Bonus logical check: ensure startDate is before or equal to endDate
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "startDate must be before or equal to endDate",
      path: ["startDate"],
    },
  );

export type CreateTransactionBody = z.infer<
  typeof createTransactionSchema
>["body"];
