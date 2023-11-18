const accountSid = "AC410b2849be6ac4bc80e8706c2a28c91d";
const authToken = "57980833ea29d5fdb65e36728fde5cc9";
const client = require("twilio")(accountSid, authToken);

client.messages
  .create({
    body: "Your appointment is coming up on July 21 at 3PM",
    from: "whatsapp:+14155238886",
    to: "whatsapp:+559870221807",
  })
  .then((message) => console.log(message))
  .catch((error) => console.error(error));
