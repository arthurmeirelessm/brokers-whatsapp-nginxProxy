const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv").config();
const client = require("twilio")(process.env.ACCOUNTSID, AUTHTOKEN);

app.use(bodyParser.json());

app.use(cors());

app.post("/twilio", (req, res) => {
  return SendMessage();
});

app.post("/twilio", (req, res) => {
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
        body: "TWILIO RESPONSE",
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

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
