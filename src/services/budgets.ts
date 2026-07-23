import { CreateBudgetBody, UpdateBudgetBody } from "../validators/budgets";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";

export async function createBudget(
  budgetDetails: CreateBudgetBody,
  userId: string,
) {
  const { amount, categoryId, month, year } = budgetDetails;
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) throw new AppError("Invalid category id", 404);
  if (category.userId !== userId) throw new AppError("Unauthorized", 403);

  const newBudget = await prisma.budget.create({
    data: {
      amount,
      categoryId,
      month,
      year,
      userId,
    },
    select: {
      id: true,
      amount: true,
      categoryId: true,
      month: true,
      year: true,
      userId: true,
    },
  });

  return newBudget;
}

interface getBudgetsQueryTypes {
  month: number;
  year: number;
}

export async function getBudgets(
  { month, year }: getBudgetsQueryTypes,
  userId: string,
) {
  const budgets = await prisma.budget.findMany({
    where: {
      userId,
      month,
      year,
    },
    select: {
      id: true,
      amount: true,
      categoryId: true,
      month: true,
      year: true,
      userId: true,
    },
  });

  return budgets;
}

export async function updateBudget(
  budgetId: string,
  body: UpdateBudgetBody,
  userId: string,
) {
  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
  });

  if (!budget) throw new AppError("Invalid budget id", 404);
  if (budget.userId !== userId) throw new AppError("Unauthorized", 403);

  await prisma.budget.update({
    where: { id: budgetId },
    data: { amount: body.amount },
    select: {
      id: true,
      amount: true,
      categoryId: true,
      month: true,
      year: true,
      userId: true,
    },
  });
}
