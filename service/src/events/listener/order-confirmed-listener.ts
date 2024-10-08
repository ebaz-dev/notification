import { Message } from "node-nats-streaming";
import { Listener } from "@ebazdev/core";
import { Order, OrderConfirmedEvent, OrderEventSubjects } from "@ebazdev/order";
import { queueGroupName } from "./queue-group-name";
import { sendNotifcation } from "../../utils/send-notificaion";

export class OrderConfirmedListener extends Listener<OrderConfirmedEvent> {
  readonly subject = OrderEventSubjects.OrderConfirmed;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderConfirmedEvent["data"], msg: Message) {
    const { id } = data;

    const order = await Order.findById(id);

    if (!order) {
      throw new Error("Order not found");
    }

    await sendNotifcation({ userId: order.userId, notification: { title: `Таны ${order.orderNo} дугаартай захиалга баталгаажлаа`, body: `Та дэлгэрэнгүй дээр дарж харна уу.` } });

    msg.ack();
  }
}
