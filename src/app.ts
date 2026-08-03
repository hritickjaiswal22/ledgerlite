import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import { authMiddleware } from "./middlewares/auth";
import { authRouter } from "./routes/auth";
import { accountsRouter } from "./routes/accounts";
import { categoriesRouter } from "./routes/categories";
import { transactionsRouter } from "./routes/transactions";
import { budgetsRouter } from "./routes/budgets";
import { reportsRouter } from "./routes/reports";
import { currenciesRouter } from "./routes/currencies";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/currencies", currenciesRouter);
app.use("/api/v1/accounts", authMiddleware, accountsRouter);
app.use("/api/v1/categories", authMiddleware, categoriesRouter);
app.use("/api/v1/transactions", authMiddleware, transactionsRouter);
app.use("/api/v1/budgets", authMiddleware, budgetsRouter);
app.use("/api/v1/reports", authMiddleware, reportsRouter);

app.use(errorHandler);

export default app;
