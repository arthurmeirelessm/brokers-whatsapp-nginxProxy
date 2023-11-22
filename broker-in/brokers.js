const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv").config();

const twilioController = require("./controllers/twilio/twilio-controller");
const smartersController = require("./controllers/smarters/smarters-controller");
const infobipController = require("./controllers/infobip/infobip-controller");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const selectedWebhook = process.env.WEBHOOK_TYPE;

let webhookController;
switch (selectedWebhook) {
  case "twilio":
    webhookController = twilioController;
    break;
  case "smarters":
    webhookController = smartersController;
    break;
  case "infobip":
    webhookController = infobipController;
    break;
  default:
    console.error("Webhook não suportado:", selectedWebhook);
    process.exit(1);
}

const processInput = async (req, res) => {
  const input = req.body;
  const queue = `${selectedWebhook}-messsages-in`;
  webhookController.processWebhookInput(input, queue);
  res.status(200).send("Mensagem recebida com sucesso");
};

app.route(`/${selectedWebhook}`).all(processInput);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
