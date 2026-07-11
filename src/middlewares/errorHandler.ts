import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).send({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).send({
    success: false,
    message: "Internal Server Error",
  });
}
