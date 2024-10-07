import express, { Request, Response } from "express";
import {
    BadRequestError,
    validateRequest,
} from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { sendNotifcation } from "../utils/send-notificaion";

const router = express.Router();

router.post(
    "/send",
    validateRequest,
    async (req: Request, res: Response) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const result = await sendNotifcation(req.body);
            await session.commitTransaction();
            res.status(StatusCodes.CREATED).send({result});
        } catch (error: any) {
            await session.abortTransaction();
            console.error("Location create operation failed", error);
            throw new BadRequestError("Location create operation failed");
        } finally {
            session.endSession();
        }
    }
);

export { router as sendRouter };