import { Router } from "express";
import {
  createAccountController,
  getAllAccountsController,
  getAccountDetailsController,
  updateAccountController,
} from "../controllers/accounts";
import { validate } from "../middlewares/validate";
import {
  createAccountSchema,
  updateAccountSchema,
} from "../validators/accounts";

const accountsRouter = Router();

accountsRouter.post(
  "/",
  validate(createAccountSchema),
  createAccountController,
);

accountsRouter.get("/", getAllAccountsController);

accountsRouter.get("/:accountId", getAccountDetailsController);

accountsRouter.patch(
  "/:accountId",
  validate(updateAccountSchema),
  updateAccountController,
);

export { accountsRouter };
