import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller";
// import { shouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/", createCategory);
router.put("/:id",  updateCategory);
router.delete("/:id",  deleteCategory);
router.get("/", getCategories);

export default router;