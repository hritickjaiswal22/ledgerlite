import { Router } from "express";
import { validate } from "../middlewares/validate";
import { createTransactionSchema } from "../validators/transactions";
import { createTransactionController } from "../controllers/transactions";

const transactionsRouter = Router();

transactionsRouter.post(
  "/",
  validate(createTransactionSchema),
  createTransactionController,
);

export { transactionsRouter };
