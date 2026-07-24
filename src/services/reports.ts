import { prisma } from "../lib/prisma";

interface getMonthsSummaryQueryTypes {
  month: number;
  year: number;
}

interface getCategoriessSummaryQueryTypes extends getMonthsSummaryQueryTypes {
  type: "income" | "expense";
}

type getBudgetSummaryQueryTypes = getMonthsSummaryQueryTypes;

export async function getMonthsSummary(
  { month, year }: getMonthsSummaryQueryTypes,
  userId: string,
) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const expense = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      userId,
      transactionType: "expense",
      transactionDate: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  const income = await prisma.transaction.aggregate({
    where: {
      userId,
      transactionType: "income",
      transactionDate: {
        gte: startDate,
        lt: endDate,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    income: income._sum.amount ?? 0,
    expense: expense._sum.amount ?? 0,
  };
}

export async function getCategoriessSummary(
  { month, year, type }: getCategoriessSummaryQueryTypes,
  userId: string,
) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const summary = await prisma.transaction.groupBy({
    by: "categoryId",
    _sum: {
      amount: true,
    },
    where: {
      userId,
      transactionType: type,
      transactionDate: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      userId,
      id: {
        in: summary.map((obj) => obj.categoryId),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const result = summary.map((g) => ({
    categoryId: g.categoryId,
    categoryName: categoryMap.get(g.categoryId),
    amount: g._sum.amount ?? 0,
  }));

  return result;
}

export async function getBudgetSummary(
  { month, year }: getBudgetSummaryQueryTypes,
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
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const spents = await prisma.transaction.groupBy({
    by: "categoryId",
    _sum: {
      amount: true,
    },
    where: {
      userId,
      transactionType: "expense",
      transactionDate: {
        gte: startDate,
        lt: endDate,
      },
      categoryId: {
        in: budgets.map((obj) => obj.categoryId),
      },
    },
  });

  const spentsMap = new Map(spents.map((c) => [c.categoryId, c._sum.amount]));

  const combined = budgets.map((obj) => {
    const spent = spentsMap.get(obj.categoryId) || 0;
    const budget = Number(obj.amount);
    const remaining = budget - (Number(spentsMap.get(obj.categoryId)) || 0);
    const percentageUsed =
      budget === 0 ? 0 : ((Number(spent) / budget) * 100).toFixed(2);

    return {
      id: obj.id,
      categoryId: obj.categoryId,
      budget,
      category: obj.category.name,
      spent,
      remaining,
      percentageUsed,
    };
  });

  return combined;
}
