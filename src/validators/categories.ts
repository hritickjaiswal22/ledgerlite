import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1),
  }),
});

export const updateCategorySchema = createCategorySchema.clone();

export type CreateCategoryBody = z.infer<typeof createCategorySchema>["body"];
export type UpdateCategoryBody = z.infer<typeof updateCategorySchema>["body"];
