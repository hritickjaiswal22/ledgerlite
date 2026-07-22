import { CreateAccountBody, UpdateAccountBody } from "../validators/accounts";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";

export async function createAccount(
  accDetails: CreateAccountBody,
  userId: string,
) {
  const account = await prisma.account.create({
    data: {
      name: accDetails.name,
      balance: accDetails.balance,
      userId: userId,
      type: accDetails.type,
    },
  });

  return account;
}

export async function getAllAccounts(userId: string) {
  const accounts = await prisma.account.findMany({
    where: {
      userId: userId,
    },
  });

  return accounts;
}

export async function getAccountDetails(accountId: string, userId: string) {
  const account = await prisma.account.findUnique({
    where: {
      id: accountId,
    },
  });

  if (!account) throw new AppError("Invalid account id", 404);
  if (account.userId !== userId) throw new AppError("Unauthorized", 403);

  return account;
}

export async function updateAccount(
  accountId: string,
  body: UpdateAccountBody,
  userId: string,
) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });

  if (!account) throw new AppError("Invalid account id", 404);
  if (account.userId !== userId) throw new AppError("Unauthorized", 403);

  await prisma.account.update({
    where: { id: accountId },
    data: { name: body.name },
  });
}
