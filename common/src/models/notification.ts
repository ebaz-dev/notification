import { Document, Schema, Types, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface NotificationDoc extends Document {
    userId: Types.ObjectId;
    title: string;
    body: string;
    data: any;

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
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.updatedAt;
                delete ret.version;
            },
        },
    }
);

notificationSchema.set("versionKey", "version");
notificationSchema.plugin(updateIfCurrentPlugin);

const Notification = model<NotificationDoc>("Notification", notificationSchema);

export { NotificationDoc, Notification };


