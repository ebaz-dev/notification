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
    res.status(StatusCodes.OK).send(data);
  }
);

export { router as listRouter };
