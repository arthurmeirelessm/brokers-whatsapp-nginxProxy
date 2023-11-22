const rabbitmq = require("../../../rabbitmq-services/message-in");

function processWebhookInput(smartersData, queue) {
  console.log(smartersData);
}

function processTextInput(twilioData, queue) {
  console.log(twilioData);
  const output = {
    type: "text",
    body: twilioData.Body,
    clientNumber: twilioData.WaId,
    NumMedia: twilioData.NumMedia,
    metadata: {
      "client-id": 1213,
      "nome-do-cliente": twilioData.ProfileName,
      SmsMessageSid: twilioData.SmsMessageSid,
      SmsSid: twilioData.SmsSid,
      MessageSid: twilioData.MessageSid,
    },
  };

  console.log(output);

  return rabbitmq.connectRabbitMQ(output, queue);
}

function processTextInput(twilioData, queue) {
  console.log(twilioData);
  const output = {
    type: "text",
    body: twilioData.Body,
    clientNumber: twilioData.WaId,
    NumMedia: twilioData.NumMedia,
    metadata: {
      "client-id": 1213,
      "nome-do-cliente": twilioData.ProfileName,
      SmsMessageSid: twilioData.SmsMessageSid,
      SmsSid: twilioData.SmsSid,
      MessageSid: twilioData.MessageSid,
    },
  };

  function processImageInput(twilioData, queue) {
    console.log(twilioData);
    const output = {
      type: "image",
      body: twilioData.Body,
      clientNumber: twilioData.WaId,
      NumMedia: twilioData.NumMedia,
      metadata: {
        "client-id": 1213,
        "nome-do-cliente": twilioData.ProfileName,
        SmsMessageSid: twilioData.SmsMessageSid,
        SmsSid: twilioData.SmsSid,
        MessageSid: twilioData.MessageSid,
      },
    };

    console.log(output);

    return rabbitmq.connectRabbitMQ(output, queue);
  }

  function processAudioInput(twilioData, queue) {
    console.log(twilioData);
    const output = {
      type: "audio",
      body: twilioData.Body,
      clientNumber: twilioData.WaId,
      NumMedia: twilioData.NumMedia,
      metadata: {
        "client-id": 1213,
        "nome-do-cliente": twilioData.ProfileName,
        SmsMessageSid: twilioData.SmsMessageSid,
        SmsSid: twilioData.SmsSid,
        MessageSid: twilioData.MessageSid,
      },
    };

    console.log(output);

    return rabbitmq.connectRabbitMQ(output, queue);
  }

  function processStickerInput(twilioData, queue) {
    console.log(twilioData);
    const output = {
      type: "sticker",
      body: twilioData.Body,
      clientNumber: twilioData.WaId,
      NumMedia: twilioData.NumMedia,
      metadata: {
        "client-id": 1213,
        "nome-do-cliente": twilioData.ProfileName,
        SmsMessageSid: twilioData.SmsMessageSid,
        SmsSid: twilioData.SmsSid,
        MessageSid: twilioData.MessageSid,
      },
    };

    console.log(output);

    return rabbitmq.connectRabbitMQ(output, queue);
  }

  function processVideoInput(twilioData, queue) {
    console.log(twilioData);
    const output = {
      type: "video",
      body: twilioData.Body,
      clientNumber: twilioData.WaId,
      NumMedia: twilioData.NumMedia,
      metadata: {
        "client-id": 1213,
        "nome-do-cliente": twilioData.ProfileName,
        SmsMessageSid: twilioData.SmsMessageSid,
        SmsSid: twilioData.SmsSid,
        MessageSid: twilioData.MessageSid,
      },
    };

    console.log(output);

    return rabbitmq.connectRabbitMQ(output, queue);
  }

  console.log(output);

  return rabbitmq.connectRabbitMQ(output, queue);
}

module.exports = {
  processWebhookInput,
};
