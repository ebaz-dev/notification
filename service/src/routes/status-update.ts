import express, { Request, Response } from "express";
import {
    BadRequestError,
    currentUser,
    NotFoundError,
    requireAuth,
    validateRequest,
} from "@ebazdev/core";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { Notification } from "../shared";

const router = express.Router();

router.post(
    "/status/update",
    [
        body("id")
            .notEmpty()
            .isString()
            .withMessage("Notification ID is required"),
        body("status")
            .notEmpty()
            .matches(/\b(?:unread|readed|deleted)\b/)
            .isString()
            .withMessage("Status is required"),
    ], currentUser, requireAuth,
    validateRequest,
    async (req: Request, res: Response) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        const data = req.body;
        try {
            const notificaion = await Notification.findOne({ _id: data.id, userId: req.currentUser?.id }
            ).session(session);
            if (!notificaion) {
                throw new NotFoundError();
            }
            notificaion.status = data.status;
            await notificaion.save();
            await session.commitTransaction();
            res.status(StatusCodes.OK).send({ data: notificaion });
        } catch (error: any) {
            await session.abortTransaction();
            console.error("Update notification status operation failed", error);
            throw new BadRequestError("Update notification status operation failed");
        } finally {
            session.endSession();
        }
    }
);

export { router as statusUpdateRouter };