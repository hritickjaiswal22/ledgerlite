import { Router } from "express";
import {
  getMonthsSummaryController,
  getCategoriesSummaryController,
  getBudgetsSummaryController,
} from "../controllers/reports";

const reportsRouter = Router();

reportsRouter.get("/month-summary", getMonthsSummaryController);
reportsRouter.get("/category-summary", getCategoriesSummaryController);
reportsRouter.get("/budget-summary", getBudgetsSummaryController);

export { reportsRouter };
