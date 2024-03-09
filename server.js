
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  // Generate a random color for each client
  const clientColor = Math.floor(Math.random() * 360);
  const id = uuidv4();
  const metadata = { id, clientColor };
  clients.set(ws, metadata);

  ws.on('message', (messageAsString) => {
    const message = JSON.parse(messageAsString);
    const metadata = clients.get(ws);

    message.sender = metadata.id;
    message.clientColor = metadata.clientColor;

    [...clients.keys()].forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
  });  


  ws.on('close', function close() {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
