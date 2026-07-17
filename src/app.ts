import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { authMiddleware } from "./middlewares/auth";
import { authRouter } from "./routes/auth";
import { accountsRouter } from "./routes/accounts";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/accounts", authMiddleware, accountsRouter);

app.use(errorHandler);

export default app;
