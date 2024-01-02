import connectRabbitMQ from "../../../rabbitmq-services/message-in.js";

import dotenv from "dotenv";
dotenv.config();

const selectedWebhook = process.env.WEBHOOK_TYPE;

export default function processSmartersWebhookInput(smartersData, queue) {
  const contentType = smartersData.header.contentType;

  let output;

  if (contentType === "text") {
    output = processTextInput(smartersData);
  } else if (contentType === "location") {
    output = processLocationInput(smartersData);
  } else {
    const mediaContentType = contentType;
    const processFunction = mediaTypeProcessors[mediaContentType];

    if (processFunction) {
      output = processFunction(smartersData);
    } else {
      console.error(`Tipo de mídia não suportado: ${mediaContentType}`);
      return null;
    }
  }

  return connectRabbitMQ(output, queue);
}

function processTextInput(smartersData) {
  const output = createOutputObject(smartersData, "text");
  output.body = smartersData.content.text;
  console.log(output);
  return output;
}

function createOutputObject(smartersData, type) {
  const commonMetadata = {
    clientId: 1213,
    client: smartersData.header.sender.name,
    MessageSid: smartersData.header.messageID,
  };

  return {
    broker: selectedWebhook,
    type: type,
    clientNumber: smartersData.header.sender.id,
    metadata: commonMetadata,
  };
}

const mediaTypeProcessors = {
  video: processVideoInput,
  voice: processAudioInput,
  contacts: processContactInput,
  document: processPdfInput,
  image: processImageInput,
  sticker: processStickerInput,
};

function processImageInput(smartersData) {
  const output = createOutputObject(smartersData, "image");
  output.media = smartersData.content.image.url;
  return output;
}

function processAudioInput(smartersData) {
  const output = createOutputObject(smartersData, "audio");
  output.media = smartersData.content.voice.url;
  return output;
}

function processStickerInput(smartersData) {
  const output = createOutputObject(smartersData, "sticker");
  output.media = smartersData.content.sticker.url;
  return output;
}

function processLocationInput(smartersData) {
  const output = createOutputObject(smartersData, "location");
  output.latitude = smartersData.content.latitude;
  output.longitude = smartersData.content.longitude;
  return output;
}

function processContactInput(smartersData) {
  const output = createOutputObject(smartersData, "contact");
  return output;
}

function processPdfInput(smartersData) {
  const output = createOutputObject(smartersData, "pdf");
  output.media = smartersData.content.document.url;
  output.file = smartersData.content.document.filename;
  return output;
}

function processVideoInput(smartersData) {
  const output = createOutputObject(smartersData, "video");
  output.media = smartersData.content.video.url;
  return output;
}
