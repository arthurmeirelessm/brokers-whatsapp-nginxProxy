const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv").config();
const client = require("twilio")(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const rabbitmq = require("../rabbitmq-services/rabbitmq-service");
const amqp = require("amqplib");
const rabbitMQUrl = "amqp://localhost"; // ou o endereço do seu servidor RabbitMQ

app.use(bodyParser.json());

app.use(cors());

const rabbitmqPassword = process.env.RABBITMQ_DEFAULT_PASS;

app.post("/twilio", async (req, res) => {
  input = req.body.Body;
  queue = "twilio-in";
  await connectRabbitMQ(queue);
  return SendMessage();
});

app.post("/blip", (req, res) => {
  const responseData = {
    statusCode: res.statusCode,
    statusMessage: res.statusMessage,
    headers: res.getHeaders(),
    body: req.body.user,
  };

  return res.send;
});

function SendMessage() {
  console.log("passei");
  return new Promise((resolve, reject) => {
    client.messages
      .create({
        body: "mensagem envida pra fila 'twilio-in'",
        from: "whatsapp:+14155238886",
        to: "whatsapp:+559870221807",
      })
      .then((message) => {
        console.log(message.sid);
        resolve(message.sid);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

async function connectRabbitMQ(queueName, input) {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: true });
    console.log(channel);

    return await rabbitmq.sendToRabbitmq(channel, input, queueName);
  } catch (error) {
    console.error("Erro ao conectar ao RabbitMQ:", error.message);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
