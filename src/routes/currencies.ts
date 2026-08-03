import { Router } from "express";
import { getAllAccountsCurrencies } from "../controllers/currencies";

const currenciesRouter = Router(); // Initialize the router instance

currenciesRouter.get("/", getAllAccountsCurrencies);

export { currenciesRouter };
