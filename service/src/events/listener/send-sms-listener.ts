import { Listener } from "@ebazdev/core";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import axios from "axios";
import { NotificationEventSubject, SendSMSEvent } from "../../shared";

export class SendSMSListener extends Listener<SendSMSEvent> {
  subject: NotificationEventSubject.SendSMS = NotificationEventSubject.SendSMS;
  queueGroupName = queueGroupName;
  async onMessage(data: SendSMSEvent["data"], msg: Message) {
    if (data.phoneNumber) {
      const response = await axios.post(
        "https://api2.ebazaar.mn/api/noticenter/local/notifier/fcm",
        {
          phone: data.phoneNumber,
          text: data.text,
        },
        {
          headers: {
            master_token:
              "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
          },
        }
      );
    }
    msg.ack();
  }
}
