import { CreateTransactionBody } from "../validators/transactions";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";
import { Account } from "../generated/prisma/client";

export async function createTransaction(
  body: CreateTransactionBody,
  userId: string,
) {
  const { accountId, amount, categoryId, transactionDate, type, description } =
    body;
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) throw new AppError("Invalid category id", 404);
  if (category.userId !== userId) throw new AppError("Unauthorized", 403);

  return await prisma.$transaction(async (tx) => {
    const [account] = await tx.$queryRaw<Account[]>`
      SELECT id,
      user_id AS "userId",
      name,
      balance,
      type
      FROM accounts
      WHERE id = ${accountId}
      AND user_id = ${userId}
      FOR UPDATE
    `;

    if (!account) throw new AppError("Invalid account id", 404);
    if (account.userId !== userId) throw new AppError("Unauthorized", 403);

    if (
      (account.type === "BANK" || account.type === "CASH") &&
      type === "expense" &&
      Number(account.balance) - amount < 0
    )
      throw new AppError("Insufficient funds for this transaction", 422);

    const balanceDelta = type === "income" ? amount : -amount;

    await tx.account.update({
      where: {
        id: accountId,
      },
      data: {
        balance: {
          increment: balanceDelta,
        },
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        amount,
        transactionDate,
        transactionType: type,
        accountId,
        categoryId,
        userId,
        description,
      },
    });

    return transaction;
  });
}

interface getTransactionsQueryTypes {
  limit: number;
}

export async function getTransactions(
  queries: getTransactionsQueryTypes,
  userId: string,
) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        transactionDate: "desc",
      },
      {
        id: "desc",
      },
    ],
    take: queries.limit,
    select: {
      id: true,
      accountId: true,
      amount: true,
      categoryId: true,
      description: true,
      transactionDate: true,
      transactionType: true,
    },
  });

  return transactions;
}
