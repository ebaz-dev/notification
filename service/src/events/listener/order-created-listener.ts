import { Message } from "node-nats-streaming";
import { Listener } from "@ebazdev/core";
import { Order, OrderCreatedEvent, OrderEventSubjects } from "@ebazdev/order";
import { queueGroupName } from "./queue-group-name";
import { sendMassNotifcation } from "../../utils/send-mass-notificaion";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = OrderEventSubjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id } = data;

    const order = await Order.findById(id);

    if (!order) {
      throw new Error("Order not found");
    }

    await sendMassNotifcation({
      userIds: [order.userId],
      title: `Таны ${order.orderNo} дугаартай захиалга үүслээ`,
      body: `Та дэлгэрэнгүй дээр дарж харна уу.`,
      senderName: "system",
      supplierId: order.supplierId,
    });

    msg.ack();
  }
}
