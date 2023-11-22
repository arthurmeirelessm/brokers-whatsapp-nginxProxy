const amqp = require("amqplib");

async function connectRabbitMQ(input, queue) {
  try {
    const connection = await amqp.connect("amqp://my-rabbitmq");
    const channel = await connection.createChannel();
    const clientNumber = input.clientNumber;

    await channel.assertQueue(queue, { durable: true });
    await channel.assertQueue("reports", { durable: true });

    const mensagem = JSON.stringify(input);

    const properties = {
      headers: {
        clientNumber: clientNumber,
      },
      persistent: true,
    };

    channel.sendToQueue(queue, Buffer.from(mensagem), properties);
    channel.sendToQueue("reports", Buffer.from(mensagem), properties);

    await channel.waitForConfirms();

    connection.close();
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
}

module.exports = {
  connectRabbitMQ,
};
