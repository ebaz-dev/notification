import {
  currentUser,
  listAndCount,
  QueryOptions,
  requireAuth,
  validateRequest,
} from "@ebazdev/core";
import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Notification, NotificationStatus } from "../shared";
const router = express.Router();

router.get(
  "/list",
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const criteria: any = {
      status: { $ne: NotificationStatus.Deleted },
      "receivers.id": req.currentUser?.id,
    };
    if (req.query.supplierId) {
      criteria.supplierId = req.query.supplierId;
    }
    const options: QueryOptions = <QueryOptions>req.query;
    options.sortBy = "createdAt";
    options.sortDir = -1;
    const data = await listAndCount(criteria, Notification, options);
    const result = data.data.map((notification: any) => {
      const receiver = notification.receivers.find(
        (receiver: any) =>
          receiver.id.toString() === req.currentUser?.id.toString()
      );
      return { ...notification.toJSON(), status: receiver.status };
    });
    res.status(StatusCodes.OK).send({
      data: result,
      total: data.total,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
    });
  }
);

export { router as listRouter };
