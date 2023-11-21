async function sendToRabbitmq(channel, input, queueName) {
  try {
    channel.sendToQueue(queueName, Buffer.from(input));
    console.log(`[x] Enviado: ${input}`);
  } catch (error) {
    console.error("Erro ao enviar mensagem para o RabbitMQ:", error.message);
    throw error;
  }
}

module.exports = {
  sendToRabbitmq,
};
