const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv").config();
const client = require("twilio")(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const rabbitmq = require("../rabbitmq-services/rabbitmq-service");
const amqp = require("amqplib");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/twilio", async (req, res) => {
  const input = req.body.Body;
  const queue = "twilio-in";
  connectRabbitMQ(queue, input);
});

async function connectRabbitMQ(queue, input) {
  try {
    // Conectar ao servidor RabbitMQ
    const connection = await amqp.connect("amqp://my-rabbitmq");
    const channel = await connection.createChannel();

    // Garantir que a fila existe
    await channel.assertQueue(queue, { durable: false });

    // Enviar mensagem para a fila
    const mensagem = input; // Use a mensagem recebida no corpo da requisição
    channel.sendToQueue(queue, Buffer.from(mensagem));
    console.log(`[x] Mensagem enviada: ${mensagem}`);

    // Aguardar confirmação da mensagem ser processada
    await channel.waitForConfirms();

    // Fechar a conexão após enviar a mensagem e receber a confirmação
    connection.close();
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
}

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
