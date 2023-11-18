const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(bodyParser.json());

app.use(cors());

app.get("/twilio", (req, res) => {
  return res.json({ get: 200 });
});

app.post("/blip", (req, res) => {
  const responseData = {
    statusCode: res.statusCode,
    statusMessage: res.statusMessage,
    headers: res.getHeaders(),
  };

  return res.json({ responseData });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
