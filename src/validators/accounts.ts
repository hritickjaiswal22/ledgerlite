import { z } from "zod";

export const createAccountSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    balance: z
      .number()
      .min(0, "Balance must be greater than or equal to 0")
      .refine(
        // "refine" Allows you to write custom validation logic.
        (val) => {
          // Converts number to string to check decimal places
          const parts = val.toString().split(".");
          // If there's no decimal point, it's a valid integer.
          // If there is a decimal point, the fractional part must have exactly 2 digits.
          return parts.length === 1 || parts[1].length === 2;
        },
        {
          message:
            "Balance must be an integer or have exactly 2 decimal places (e.g., 10.50)",
        },
      )
      .optional(), // Makes the entire balance block optional
  }),
});

export const updateAccountSchema = z.object({
  body: z.object({
    name: z.string().min(1),
  }),
});

export type CreateAccountBody = z.infer<typeof createAccountSchema>["body"];
export type UpdateAccountBody = z.infer<typeof updateAccountSchema>["body"];
