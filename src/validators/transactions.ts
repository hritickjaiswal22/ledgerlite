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

export const getTransactionsQuerySchema = z.object({
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
});

export type CreateTransactionBody = z.infer<
  typeof createTransactionSchema
>["body"];
