import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { Prisma } from "../generated/prisma/client";

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

  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    return res.status(409).send({
      success: false,
      message: "An account with this name already exists.",
    });
  }

  return res.status(500).send({
    success: false,
    message: "Internal Server Error",
  });
}
