const amqp = require("amqplib");

async function connectRabbitMQ(queue, input, selectedBot) {
  try {
    const connection = await amqp.connect("amqp://my-rabbitmq");
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: false });

    const mensagem = input;
    channel.sendToQueue(queue, Buffer.from(mensagem));
    console.log(`[x] Mensagem enviada: ${mensagem}`);

    await channel.waitForConfirms();

    connection.close();
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
}

module.exports = {
  connectRabbitMQ,
};
