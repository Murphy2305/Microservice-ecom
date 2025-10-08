import { Router } from "express";
import { shouldBeUser } from "../middleware/middleware";
import { getUserOrders, getAllOrders, getOrderChart } from "../controllers/order.controller";

const router : Router = Router();

router.get("/user-orders", shouldBeUser, getUserOrders);
router.get("/orders", getAllOrders);
router.get("/order-chart", getOrderChart);

export default router;
