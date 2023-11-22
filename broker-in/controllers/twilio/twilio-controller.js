const rabbitmq = require("../../../rabbitmq-services/message-in");

function processWebhookInput(twilioData, queue) {
  if (!("MediaContentType0" in twilioData)) {
    if ("Longitude" && "Latitude" in twilioData) {
      return processLocationInput(twilioData, queue);
    }
    return processTextInput(twilioData, queue);
  } else {
    const mediaContentType = twilioData.MediaContentType0;
    const processFunction = mediaTypeProcessors[mediaContentType];

    if (processFunction) {
      return processFunction(twilioData, queue);
    } else {
      console.error(`Tipo de mídia não suportado: ${mediaContentType}`);
      return null;
    }
  }
}

function processTextInput(twilioData, queue) {
  const output = createOutputObject(twilioData, "text");
  output.body = twilioData.Body;
  console.log(output);
  return rabbitmq.connectRabbitMQ(output, queue);
}

function createOutputObject(twilioData, type) {
  const commonMetadata = {
    "client-id": 1213,
    "nome-do-cliente": twilioData.ProfileName,
    SmsMessageSid: twilioData.SmsMessageSid,
    SmsSid: twilioData.SmsSid,
    MessageSid: twilioData.MessageSid,
  };

  return {
    type: type,
    clientNumber: twilioData.WaId,
    NumMedia: twilioData.NumMedia,
    metadata: commonMetadata,
  };
}

const mediaTypeProcessors = {
  "video/mp4": processVideoInput,
  "audio/ogg": processAudioInput,
  "text/vcard": processContactInput,
  "application/pdf": processPdfInput,
  "image/jpeg": processImageInput,
  "image/webp": processStickerInput,
};

function processImageInput(twilioData, queue) {
  const output = createOutputObject(twilioData, "image");
  output.media = twilioData.MediaUrl0;
  return rabbitmq.connectRabbitMQ(output, queue);
}

function processAudioInput(twilioData, queue) {
  const output = createOutputObject(twilioData, "audio");
  output.media = twilioData.MediaUrl0;
  return rabbitmq.connectRabbitMQ(output, queue);
}

function processStickerInput(twilioData, queue) {
  const output = createOutputObject(twilioData, "sticker");
  output.media = twilioData.MediaUrl0;
  return rabbitmq.connectRabbitMQ(output, queue);
}

function processLocationInput(twilioData, queue) {
  const output = createOutputObject(twilioData, "location");
  output.latitude = twilioData.Latitude;
  output.longitude = twilioData.Longitude;
  return rabbitmq.connectRabbitMQ(output, queue);
}

function processContactInput(twilioData, queue) {
  const output = createOutputObject(twilioData, "contact");
  output.media = twilioData.MediaUrl0;
  return rabbitmq.connectRabbitMQ(output, queue);
}

function processPdfInput(twilioData, queue) {
  const output = createOutputObject(twilioData, "pdf");
  output.media = twilioData.MediaUrl0;
  return rabbitmq.connectRabbitMQ(output, queue);
}

function processVideoInput(twilioData, queue) {
  const output = createOutputObject(twilioData, "video");
  output.media = twilioData.MediaUrl0;
  return rabbitmq.connectRabbitMQ(output, queue);
}

module.exports = {
  processWebhookInput,
};
