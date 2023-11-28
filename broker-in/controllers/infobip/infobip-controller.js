import connectRabbitMQ from "../../../rabbitmq-services/message-in.js";
import dotenv from "dotenv";
dotenv.config();

const selectedWebhook = process.env.WEBHOOK_TYPE;

export default function processInfobipWebhookInput(infobipData, queue) {
  const message = infobipData.results[0].message;

  let output;

  if ("text" in message) {
    output = processTextInput(infobipData);
  } else if ("latitude" && "longitude" in message) {
    output = processLocationInput(infobipData);
  } else {
    const messageType = infobipData.results[0]?.message?.type;
    const processFunction = mediaTypeProcessors[messageType];

    if (processFunction) {
      output = processFunction(infobipData);
    } else {
      console.error(`Tipo de mídia não suportado: ${messageType}`);
      return null;
    }
  }

  // Chame connectRabbitMQ apenas uma vez
  return connectRabbitMQ(output, queue);
}

function processTextInput(infobipData) {
  const output = createOutputObject(infobipData, "text");
  output.body = infobipData.results[0].message.text;
  return output;
}

function createOutputObject(infobipData, type) {
  const commonMetadata = {
    clientId: 1213,
    client: infobipData.results[0].contact.name,
    MessageSid: infobipData.results[0].messageId,
    receivedAt: infobipData.results[0].receivedAt,
  };

  return {
    broker: selectedWebhook,
    type: type,
    clientNumber: infobipData.results[0].from,
    metadata: commonMetadata,
  };
}

const mediaTypeProcessors = {
  VIDEO: processVideoInput,
  VOICE: processAudioInput,
  CONTACT: processContactInput,
  DOCUMENT: processPdfInput,
  IMAGE: processImageInput,
  STICKER: processStickerInput,
};

function processImageInput(infobipData) {
  const output = createOutputObject(infobipData, "image");
  output.media = infobipData.results[0].message.url;
  return output;
}

function processAudioInput(infobipData) {
  const output = createOutputObject(infobipData, "audio");
  output.media = infobipData.results[0].message.url;
  return output;
}

function processStickerInput(infobipData) {
  const output = createOutputObject(infobipData, "sticker");
  output.media = infobipData.results[0].message.url;
  return output;
}

function processLocationInput(infobipData) {
  const output = createOutputObject(infobipData, "location");
  output.latitude = infobipData.results[0].message.latitude;
  output.longitude = infobipData.results[0].message.longitude;
  return output;
}

function processContactInput(infobipData) {
  const output = createOutputObject(infobipData, "contact");
  console.log(infobipData.results[0].contact.contacts);
  return output;
}

function processPdfInput(infobipData) {
  const output = createOutputObject(infobipData, "document");
  output.media = infobipData.results[0].message.url;
  return output;
}

function processVideoInput(infobipData) {
  const output = createOutputObject(infobipData, "video");
  output.media = infobipData.results[0].message.url;
  return output;
}
