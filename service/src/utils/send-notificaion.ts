
import { Notification } from "../shared/models/notification";
import * as admin from "firebase-admin";
import { UserDevice } from "@ebazdev/auth";

export const sendNotifcation = async (payload: any) => {
    const devices = await UserDevice.find({ userId: payload.userId, deviceToken: { $exists: true } });
    const tokens: any = devices.map(device => { return device.deviceToken });

    console.log("tokens", tokens);

    const result = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: payload.notification,
        webpush: {
            notification: {
                to: payload.notification.to,
                priority: payload.notification.priority,
                title: payload.notification.title,
                body: payload.notification.body,
                data: payload.data,
                requireInteraction: false,
            },
            fcmOptions: {
                link: payload.link,
            },
        },
    });

    console.log('res', result);
    const notification = await Notification.create({ userId: payload.userId, title: payload.notification.title, body: payload.notification.body });
    return notification;
}