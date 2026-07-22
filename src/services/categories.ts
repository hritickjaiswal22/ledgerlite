import { AppError } from "../errors/AppError";
import { prisma } from "../lib/prisma";
import {
  CreateCategoryBody,
  UpdateCategoryBody,
} from "../validators/categories";

export async function createCategory(body: CreateCategoryBody, userId: string) {
  const category = await prisma.category.create({
    data: {
      name: body.name,
      userId: userId,
    },
  });

  return category;
}

export async function getAllCategories(userId: string) {
  const allCategories = await prisma.category.findMany({
    where: {
      userId,
    },
  });

  return allCategories;
}

export async function getCategoryById(categoryId: string, userId: string) {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) throw new AppError("Invalid category id", 404);
  if (category.userId !== userId) throw new AppError("Unauthorized", 403);

  return category;
}

export async function updateCategory(
  categoryId: string,
  body: UpdateCategoryBody,
  userId: string,
) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) throw new AppError("Invalid category id", 404);
  if (category.userId !== userId) throw new AppError("Unauthorized", 403);

  await prisma.category.update({
    where: { id: categoryId },
    data: { name: body.name },
  });
}
