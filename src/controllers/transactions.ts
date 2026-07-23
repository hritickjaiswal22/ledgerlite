import { Request, Response } from "express";
import { getTransactionsQuerySchema } from "../validators/transactions";
import { createTransaction, getTransactions } from "../services/transactions";

export async function createTransactionController(req: Request, res: Response) {
  const transaction = await createTransaction(req.body, req.user?.userId || "");

  return res.status(201).send({
    success: true,
    data: transaction,
    message: "Transaction created successfully",
  });
}

export async function getTransactionsController(req: Request, res: Response) {
  const result = getTransactionsQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
    });
  }

  const transactions = await getTransactions(
    {
      ...result.data,
    },
    req.user?.userId || "",
  );

  return res.status(200).send({
    success: true,
    data: transactions,
  });
}
