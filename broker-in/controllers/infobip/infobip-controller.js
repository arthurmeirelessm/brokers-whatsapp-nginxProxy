function processWebhookInput(twilioData) {
  if ("MediaUrl0" in twilioData) {
    // Entrada com MediaUrl0
    return processMediaInput(twilioData);
  } else {
    // Entrada sem MediaUrl0
    return processTextInput(twilioData);
  }
}

function processMediaInput(twilioData) {
  return {
    text: "",
    clientNumber: twilioData.From.replace("whatsapp:", ""),
    NumMedia: 1,
    metadata: {
      "client-id": 1213,
      "nome-do-cliente": twilioData.ProfileName || "Nome do Cliente",
    },
    mediaUrl: twilioData.MediaUrl0,
    mediaContentType: twilioData.MediaContentType0,
  };
}

function processTextInput(twilioData) {
  return {
    text: twilioData.Body,
    clientNumber: twilioData.From.replace("whatsapp:", ""),
    NumMedia: 0,
    metadata: {
      "client-id": 1213,
      "nome-do-cliente": twilioData.ProfileName || "Nome do Cliente",
    },
  };
}

// Exemplo de uso
const twilioDataWithMedia = {
  MediaContentType0: "image/jpeg",
  SmsMessageSid: "MM6df95cdf94fec95a80064f389d4f1b86",
  // ... outras propriedades
  MediaUrl0:
    "https://api.twilio.com/2010-04-01/Accounts/AC410b2849be6ac4bc80e8706c2a28c91d/Messages/MM6df95cdf94fec95a80064f389d4f1b86/Media/MEa71e8cc1a648cddb303241843726b8f9",
};

const twilioDataWithoutMedia = {
  SmsMessageSid: "SM4a6d931f66d0d27221cd008381db9248",
  // ... outras propriedades
  Body: "Oi",
};

module.exports = {
  processWebhookInput,
};
