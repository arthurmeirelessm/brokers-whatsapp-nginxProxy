import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import processTwilioWebhookInput from "./controllers/twilio/twilio-controller.js";
import processSmartersWebhookInput from "./controllers/smarters/smarters-controller.js";
import processInfobipWebhookInput from "./controllers/infobip/infobip-controller.js";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const selectedWebhook = process.env.WEBHOOK_TYPE;

let webhookController;
switch (selectedWebhook) {
  case "twilio":
    webhookController = processTwilioWebhookInput;
    break;
  case "smarters":
    webhookController = processSmartersWebhookInput;
    break;
  case "infobip":
    webhookController = processInfobipWebhookInput;
    break;
  default:
    console.error("Webhook não suportado:", selectedWebhook);
    process.exit(1);
}

const processInput = async (req, res) => {
  const input = req.body;
  console.log(input);
  const queue = `${selectedWebhook}-in`;
  webhookController(input, queue, selectedWebhook);
  res.status(200).send("Mensagem recebida com sucesso");
};

app.route(`/${selectedWebhook}`).post(processInput);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
