import connectRabbitMQ from "../../../rabbitmq-services/message-in.js";
import dotenv from "dotenv";
dotenv.config();

const selectedWebhook = process.env.WEBHOOK_TYPE;

export default function processTwilioWebhookInput(twilioData, queue) {
  let output;

  if (!("MediaContentType0" in twilioData)) {
    if ("Longitude" in twilioData && "Latitude" in twilioData) {
      output = processLocationInput(twilioData);
    } else {
      output = processTextInput(twilioData);
    }
  } else {
    const mediaContentType = twilioData.MediaContentType0;
    const processFunction = mediaTypeProcessors[mediaContentType];

    if (processFunction) {
      output = processFunction(twilioData);
    } else {
      console.error(`Tipo de mídia não suportado: ${mediaContentType}`);
      return null;
    }
  }

  return connectRabbitMQ(output, queue);
}

function processTextInput(twilioData) {
  const output = createOutputObject(twilioData, "text");
  output.body = twilioData.Body;
  return output;
}

function createOutputObject(twilioData, type) {
  const commonMetadata = {
    clientId: 1213,
    client: twilioData.ProfileName,
    MessageSid: twilioData.MessageSid,
  };

  return {
    broker: selectedWebhook,
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

function processImageInput(twilioData) {
  const output = createOutputObject(twilioData, "image");
  output.media = twilioData.MediaUrl0;
  return output;
}

function processAudioInput(twilioData) {
  const output = createOutputObject(twilioData, "audio");
  output.media = twilioData.MediaUrl0;
  return output;
}

function processStickerInput(twilioData) {
  const output = createOutputObject(twilioData, "sticker");
  output.media = twilioData.MediaUrl0;
  return output;
}

function processLocationInput(twilioData) {
  const output = createOutputObject(twilioData, "location");
  output.latitude = twilioData.Latitude;
  output.longitude = twilioData.Longitude;
  return output;
}

function processContactInput(twilioData) {
  const output = createOutputObject(twilioData, "contact");
  output.media = twilioData.MediaUrl0;
  return output;
}

function processPdfInput(twilioData) {
  const output = createOutputObject(twilioData, "pdf");
  output.media = twilioData.MediaUrl0;
  return output;
}

function processVideoInput(twilioData) {
  const output = createOutputObject(twilioData, "video");
  output.media = twilioData.MediaUrl0;
  return output;
}
