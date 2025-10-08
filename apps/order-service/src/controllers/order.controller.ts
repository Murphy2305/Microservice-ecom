import { Request, Response } from "express";
import { Order } from "@repo/order-db";
import { startOfMonth, subMonths } from "date-fns";

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.userId });
    return res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 0;
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    return res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getOrderChart = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const sixMonthsAgo = startOfMonth(subMonths(now, 5));

    const raw = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
          successful: {
            $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          total: 1,
          successful: 1,
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // const results: OrderChartType[] = [];
    const results: any[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;

      const match = raw.find((item) => item.year === year && item.month === month);

      results.push({
        month: monthNames[month - 1],
        total: match ? match.total : 0,
        successful: match ? match.successful : 0,
      });
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};
