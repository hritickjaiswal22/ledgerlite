import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).send({
      success: false,
      message:
        "Authentication credentials are required. The 'Authorization' header is missing.",
    });

  const authHeaderArr = authHeader.split(" ");

  if (authHeaderArr.length !== 2 || authHeaderArr[0] !== "Bearer")
    return res.status(401).send({
      success: false,
      message:
        "Malformed Authorization header. Expected format: 'Bearer <token>'.",
    });

  try {
    const jwtPayload = verifyAccessToken(authHeaderArr[1]);

    req.user = jwtPayload;

    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid or expired access token.",
    });
  }
}
