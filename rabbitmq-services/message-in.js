import amqp from "amqplib";
import consumeMessages from "../consumer-in/consumer-rabbitmq.js";

export default async function connectRabbitMQ(input, queue) {
  console.log(input);
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const clientNumber = input.clientNumber;

    await channel.assertQueue(queue, { durable: true });
    await channel.assertQueue("reports", { durable: true });

    const mensagem = JSON.stringify(input);

    const properties = {
      persistent: true,
    };

    channel.sendToQueue(queue, Buffer.from(mensagem), properties);
    channel.sendToQueue("reports", Buffer.from(mensagem), properties);

    await consumeMessages(channel, queue, connection);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
}
