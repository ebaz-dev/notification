import { Message } from "node-nats-streaming";
import { Listener } from "@ebazdev/core";
import { Order, OrderCreatedEvent, OrderEventSubjects } from "@ebazdev/order";
import { queueGroupName } from "./queue-group-name";
import { sendNotifcation } from "../../utils/send-notificaion";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = OrderEventSubjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    try {
      const { id } = data;

      const order = await Order.findById(id);

      if (!order) {
        throw new Error("Order not found");
      }

      await sendNotifcation({ userId: order.userId, title: `Таны ${order.orderNo} дугаартай захиалга үүслээ`, body: `Таны ${order.orderNo} дугаартай захиалга үүслээ` });

      msg.ack();
    } catch (error) {
      console.error("Error processing OrderCreatedEvent:", error);
    }
  }
}
