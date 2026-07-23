import { Router } from "express";
import { validate } from "../middlewares/validate";
import { createTransactionSchema } from "../validators/transactions";
import {
  createTransactionController,
  getTransactionsController,
} from "../controllers/transactions";

const transactionsRouter = Router();

transactionsRouter.post(
  "/",
  validate(createTransactionSchema),
  createTransactionController,
);

transactionsRouter.get("/", getTransactionsController);

export { transactionsRouter };
