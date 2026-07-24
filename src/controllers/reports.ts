import { Request, Response } from "express";
import {
  getMonthSummaryQuerySchema,
  getCategoriesSummaryQuerySchema,
  getBudgetSummaryQuerySchema,
} from "../validators/reports";
import {
  getMonthsSummary,
  getCategoriessSummary,
  getBudgetSummary,
} from "../services/reports";

export async function getMonthsSummaryController(req: Request, res: Response) {
  const result = getMonthSummaryQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
    });
  }

  const summary = await getMonthsSummary(
    {
      ...result.data,
    },
    req.user?.userId || "",
  );

  return res.status(200).send({
    success: true,
    data: summary,
  });
}

export async function getCategoriesSummaryController(
  req: Request,
  res: Response,
) {
  const result = getCategoriesSummaryQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
    });
  }

  const summary = await getCategoriessSummary(
    {
      ...result.data,
    },
    req.user?.userId || "",
  );

  return res.status(200).send({
    success: true,
    data: summary,
  });
}

export async function getBudgetsSummaryController(req: Request, res: Response) {
  const result = getBudgetSummaryQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
    });
  }

  const summary = await getBudgetSummary(
    {
      ...result.data,
    },
    req.user?.userId || "",
  );

  return res.status(200).send({
    success: true,
    data: summary,
  });
}
