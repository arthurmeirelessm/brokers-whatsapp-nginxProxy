const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv").config();
const rabbitmq = require("../rabbitmq-services/rabbitmq-service");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const selectedBot = process.env.BOT_TYPE;
const selectedWebhook = process.env.WEBHOOK_TYPE;

const processInput = async (req, res) => {
  const input = req.body.Body;
  const queue = `${selectedWebhook}-in`;
  rabbitmq.connectRabbitMQ(queue, input, selectedBot);
};

app.route(`/${selectedWebhook}`).all(processInput);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
