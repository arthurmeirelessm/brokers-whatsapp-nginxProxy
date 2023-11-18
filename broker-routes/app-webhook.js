const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");

// Configurar body-parser para lidar com JSON
app.use(bodyParser.json());

app.use(cors());

// Rota para lidar com o webhook do Twilio
app.get("/twilio", (req, res) => {
  // Exibir os parâmetros recebidos

  return res.json({ get: 200 });
});

app.post("/blip", (req, res) => {
  // Exibir apenas as informações relevantes de res
  const responseData = {
    statusCode: res.statusCode,
    statusMessage: res.statusMessage,
    headers: res.getHeaders(),
  };

  return res.json({ responseData });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
