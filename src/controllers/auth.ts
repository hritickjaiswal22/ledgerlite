import { Request, Response } from "express";
import { signup, signin, refresh } from "../services/auth";

export async function signupController(req: Request, res: Response) {
  const data = await signup(req.body);

  return res.status(201).send({
    success: true,
    data,
    message: "User created successfully",
  });
}

export async function signinController(req: Request, res: Response) {
  const data = await signin(req.body);

  return res.status(200).send({
    success: true,
    data,
    message: "User logged in successfully",
  });
}

export async function refreshController(req: Request, res: Response) {
  const data = await refresh(req.body);

  return res.status(200).send({
    success: true,
    data,
    message: "User logged in successfully",
  });
}
