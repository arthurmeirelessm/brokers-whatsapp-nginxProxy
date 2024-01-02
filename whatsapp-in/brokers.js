import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import processTwilioWebhookInput from "./controllers/twilio/twilio-controller.js";
import processSmartersWebhookInput from "./controllers/smarters/smarters-controller.js";
import processInfobipWebhookInput from "./controllers/infobip/infobip-controller.js";

const app = express();
const port = 3000;
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const webhookControllers = {
  twilio: processTwilioWebhookInput,
  smarters: processSmartersWebhookInput,
  infobip: processInfobipWebhookInput,
};

const selectedWebhook = process.env.WEBHOOK_TYPE;

const webhookController = webhookControllers[selectedWebhook];

if (!webhookController) {
  console.error("Webhook não suportado:", selectedWebhook);
  process.exit(1);
}

const processInput = async (req, res) => {
  const input = req.body;
  const queue = `${selectedWebhook}-in`;
  webhookController(input, queue, selectedWebhook);
  res.status(200).send("Mensagem recebida com sucesso");
};

app.route(`/${selectedWebhook}`).post(processInput);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
