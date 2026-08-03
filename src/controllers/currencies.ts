import { Request, Response } from "express";
import { getAllCurrencies } from "../services/currencies";

export async function getAllAccountsCurrencies(req: Request, res: Response) {
  const currencies = await getAllCurrencies();

  return res.status(200).send({
    success: true,
    data: currencies,
  });
}
