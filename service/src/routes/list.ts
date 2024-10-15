import {
  currentUser,
  requireAuth,
  validateRequest,
} from "@ebazdev/core";
import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Notification, NotificationStatus } from "../shared";
import { Types } from "mongoose";
const router = express.Router();

router.get(
  "/list",
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const criteria: any = {
      "receivers.id": new Types.ObjectId(req.currentUser?.id),
    };
    if (req.query.supplierId) {
      criteria.supplierId = req.query.supplierId;
    }

    if (req.query.startDate) {
      criteria["createdAt"] = { $gte: new Date(req.query.startDate as string) };
    }
    if (req.query.endDate) {
      if (req.query.startDate) {
        criteria["createdAt"] = {
          $gte: new Date(req.query.startDate as string),
          $lte: new Date(req.query.endDate as string),
        };
      } else {
        criteria["createdAt"] = { $lte: new Date(req.query.endDate as string) };
      }
    }
    const secondCriteria: any = {
      status: { $ne: NotificationStatus.Deleted },
    };

    if (req.query.status) {
      secondCriteria.status = req.query.status;
    }
    const listAggregates: any = [
      { $match: criteria },
      { $unwind: "$receivers" },
      {
        $project: {
          _id: false,
          id: "$_id",
          title: 1,
          body: 1,
          status: "$receivers.status",
          senderName: 1,
          supplierId: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $match: secondCriteria },
      { $sort: { createdAt: -1 } },
    ];
    const countAggregates = listAggregates.concat([
      {
        $count: "count",
      },
    ]);
    if (req.query.limit) {
      const limit = Number(req.query.limit);
      if (req.query.page) {
        const skip = (Number(req.query.page) - 1) * limit;
        listAggregates.push({ $skip: skip });
      }
      listAggregates.push({ $limit: limit });
    }
    const notifications = await Notification.aggregate(listAggregates);
    const count = await Notification.aggregate(countAggregates);
    const total = count[0] ? count[0].count : 0;
    const totalPages = Math.ceil(
      req.query.limit ? total / Number(req.query.limit) : total / total
    );
    const currentPage = req.query.page ? Number(req.query.page) : 1;
    res.status(StatusCodes.OK).send({
      data: notifications,
      total,
      totalPages,
      currentPage,
    });
  }
);

export { router as listRouter };
