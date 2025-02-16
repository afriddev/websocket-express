const app = require("./src/app");
const wss = require("./src/webSocket");

const server = app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});

// Upgrade HTTP to WebSocket
server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
    });
});
