async function sendToRabbitmq(channel, input, queueName) {
  try {
    channel.sendToQueue(queueName, Buffer.from(mensagem));
    console.log(`[x] Enviado: ${mensagem}`);
  } catch (error) {
    console.error("Erro ao enviar mensagem para o RabbitMQ:", error.message);
    throw error;
  }
}

module.exports = {
  sendToRabbitmq,
};
