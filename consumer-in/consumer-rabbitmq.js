import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config();

const selectedWebhook = process.env.WEBHOOK_TYPE;

async function consumeMessages() {
  const connection = await amqp.connect("amqp://my-rabbitmq");
  const channel = await connection.createChannel();

  const queueName = `${selectedWebhook}-in`;
  await channel.assertQueue(queueName, { durable: true });

  console.log(`Consumindo mensagens da fila ${queueName}`);

  channel.consume(queueName, async (message) => {
    if (message !== null) {
      const content = message.content.toString();
      console.log(`Mensagem recebida: ${content}`);

      try {
        // Processa e envia a mensagem para o bot de forma assíncrona
        await processAndSendToBot(content);

        // Confirma o recebimento da mensagem
        channel.ack(message);
      } catch (error) {
        console.error(`Erro ao processar a mensagem: ${error.message}`);
        // Pode adicionar lógica de tratamento de erro, como rejeitar a mensagem
      }
    }
  });
}

consumeMessages();
