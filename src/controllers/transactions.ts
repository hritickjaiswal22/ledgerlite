import { Request, Response } from "express";
import { createTransaction } from "../services/transactions";

export async function createTransactionController(req: Request, res: Response) {
  const transaction = await createTransaction(req.body, req.user?.userId || "");

  return res.status(201).send({
    success: true,
    data: transaction,
    message: "Transaction created successfully",
  });
}
