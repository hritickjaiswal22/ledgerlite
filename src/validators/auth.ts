import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
    selectedCurrencyId: z.uuid(),
  }),
});

export const signinSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export type SignupBody = z.infer<typeof signupSchema>["body"];
export type SigninBody = z.infer<typeof signinSchema>["body"];
export type RefreshBody = z.infer<typeof refreshSchema>["body"];
