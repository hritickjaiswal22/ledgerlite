import { Router } from "express";
import { validate } from "../middlewares/validate";
import { createBudgetSchema, updateBudgetSchema } from "../validators/budgets";
import {
  createBudgetController,
  getBudgetsController,
  updateBudgetController,
} from "../controllers/budgets";

const budgetsRouter = Router();

budgetsRouter.post("/", validate(createBudgetSchema), createBudgetController);

budgetsRouter.get("/", getBudgetsController);

budgetsRouter.patch(
  "/:budgetId",
  validate(updateBudgetSchema),
  updateBudgetController,
);

export { budgetsRouter };
