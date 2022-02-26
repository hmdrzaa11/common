import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "../subjects";

interface Event {
  subject: Subjects;
  data: any;
}

abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void | Promise<void>;

  protected client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    let subscription = this.client.subscribe(
      this.subject,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `Event Received from channel "${this.subject}" and station of "${this.queueGroupName}"`
      );

      let data: T["data"] = this.parseMessage(msg);

      this.onMessage(data, msg);
    });
  }

  parseMessage(msg: Message) {
    let data = msg.getData();

    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}

export { Listener };
