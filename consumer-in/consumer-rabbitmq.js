export default async function consumeMessages(channel, queue, connection) {
  try {
    await channel.assertQueue(queue, { durable: true });
    await channel.consume(
      queue,
      (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          const timestamp = new Date().toISOString();

          console.log(`[${timestamp}] Received message:`);
          console.log(content);
        }
      },
      { noAck: true }
    );

    connection.close();
    console.log(" [*] Waiting for messages. To exit press CTRL+C");
  } catch (err) {
    console.warn(err);
  }
}
