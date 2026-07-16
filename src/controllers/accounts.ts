import { Request, Response } from "express";
import {
  createAccount,
  getAccountDetails,
  getAllAccounts,
  updateAccount,
} from "../services/accounts";

export async function createAccountController(req: Request, res: Response) {
  const newAccount = await createAccount(req.body, req.user?.userId || "");

  return res.status(201).send({
    success: true,
    data: newAccount,
    message: "Account created successfully",
  });
}

export async function getAllAccountsController(req: Request, res: Response) {
  const accounts = await getAllAccounts(req.user?.userId || "");

  return res.status(200).send({
    success: true,
    data: accounts,
  });
}

type AccountParams = {
  accountId: string;
};

export async function getAccountDetailsController(
  req: Request<AccountParams>,
  res: Response,
) {
  const account = await getAccountDetails(
    req.params.accountId,
    req.user?.userId || "",
  );

  return res.status(200).send({
    success: true,
    data: account,
  });
}

export async function updateAccountController(
  req: Request<AccountParams>,
  res: Response,
) {
  await updateAccount(req.params.accountId, req.body, req.user?.userId || "");

  return res.status(204).send({
    success: true,
    message: "Account updated successfully",
  });
}
