import { Router } from "express";
import { validate } from "../middlewares/validate";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/categories";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryDetailsController,
  updateCategoryController,
} from "../controllers/categories";

const categoriesRouter = Router();

categoriesRouter.post(
  "/",
  validate(createCategorySchema),
  createCategoryController,
);

categoriesRouter.get("/", getAllCategoriesController);

categoriesRouter.get("/:categoryId", getCategoryDetailsController);

categoriesRouter.patch(
  "/:categoryId",
  validate(updateCategorySchema),
  updateCategoryController,
);

export { categoriesRouter };
