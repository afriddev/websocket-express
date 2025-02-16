const WebSocket = require("ws");
const users = new Map();

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws, request) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const senderEmail = url.searchParams.get("senderEmail");
  const receiverEmail = url.searchParams.get("receiverEmail");

  if (senderEmail && receiverEmail) {
    users.set(senderEmail, { ws, receiverEmail });
    ws.on("message", (message) => {
      if (Buffer.isBuffer(message)) {
        message = message.toString();
      }
      const [sender, msgContent] = message.split(":");
      if (sender && msgContent) {
        const receiverSocket = users.get(receiverEmail);
        if (receiverSocket) {
          receiverSocket.ws.send(`${sender}:${msgContent}`);
        }
      }
    });

    ws.on("close", () => {
      users.delete(senderEmail);
    });
  }
});

module.exports = wss;
