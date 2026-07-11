import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export function validate<T extends z.ZodObject<z.core.$ZodShape>>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
    });

    if (!result.success) {
      return res.status(422).send({
        success: false,
        message: "Invalid Request Data",
      });
    }

    req.body = result.data.body;

    next();
  };
}
