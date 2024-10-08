import { Document, Schema, Types, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export enum NotificationStatus {
    Unread = "unread",
    Readed = "readed",
    Deleted = "deleted"
}

interface NotificationDoc extends Document {
    userId: Types.ObjectId;
    title: string;
    body: string;
    data: any;
    status: NotificationStatus

}

const notificationSchema = new Schema<NotificationDoc>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: "User",
        },
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: false,
        },

        data: {
            type: Object,
            required: false,
        },
        status: { type: String, enum: Object.values(NotificationStatus), required: true, default: NotificationStatus.Unread },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.version;
            },
        },
    }
);

notificationSchema.set("versionKey", "version");
notificationSchema.plugin(updateIfCurrentPlugin);

const Notification = model<NotificationDoc>("Notification", notificationSchema);

export { NotificationDoc, Notification };


