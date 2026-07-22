import { z } from "zod";

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

export type CreateTransactionBody = z.infer<
  typeof createTransactionSchema
>["body"];
