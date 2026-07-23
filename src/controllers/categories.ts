import { Request, Response } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../services/categories";

export async function createCategoryController(req: Request, res: Response) {
  const category = await createCategory(req.body, req.user?.userId || "");

  return res.status(201).send({
    success: true,
    data: category,
    message: "Category created successfully",
  });
}

export async function getAllCategoriesController(req: Request, res: Response) {
  const categories = await getAllCategories(req.user?.userId || "");

  return res.status(200).send({
    success: true,
    data: categories,
  });
}

type CategoryParams = {
  categoryId: string;
};

export async function getCategoryDetailsController(
  req: Request<CategoryParams>,
  res: Response,
) {
  const category = await getCategoryById(
    req.params.categoryId,
    req.user?.userId || "",
  );

  return res.status(200).send({
    success: true,
    data: category,
  });
}

export async function updateCategoryController(
  req: Request<CategoryParams>,
  res: Response,
) {
  await updateCategory(req.params.categoryId, req.body, req.user?.userId || "");

  return res.status(204).send();
}
