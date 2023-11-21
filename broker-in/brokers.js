const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv").config();
const client = require("twilio")(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const rabbitmq = require("../rabbitmq-services/rabbitmq-service");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/twilio", async (req, res) => {
  const input = req.body.Body;
  console.log(req.body);
  const queue = "twilio-in";
  rabbitmq.connectRabbitMQ(queue, input);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
