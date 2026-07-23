import { Request, Response } from "express";
import { createBudget, getBudgets, updateBudget } from "../services/budgets";
import { getBudgetsQuerySchema } from "../validators/budgets";

export async function createBudgetController(req: Request, res: Response) {
  const newBudget = await createBudget(req.body, req.user?.userId || "");

  return res.status(201).send({
    success: true,
    data: newBudget,
    message: "Budget created successfully",
  });
}

export async function getBudgetsController(req: Request, res: Response) {
  const result = getBudgetsQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
    });
  }

  const budgets = await getBudgets(
    {
      ...result.data,
    },
    req.user?.userId || "",
  );

  return res.status(200).send({
    success: true,
    data: budgets,
  });
}

type BudgetParams = {
  budgetId: string;
};

export async function updateBudgetController(
  req: Request<BudgetParams>,
  res: Response,
) {
  await updateBudget(req.params.budgetId, req.body, req.user?.userId || "");

  return res.status(204).send();
}
