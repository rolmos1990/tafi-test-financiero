const WebSocket = require('ws');

class WebSocketManager {
  constructor(server, webSocketController, client) {
    this.wss = new WebSocket.Server({ server });
    this.webSocketController = webSocketController;
    this.client = client;
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('Client connected');

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }

  sendNotification(info = 'New subscription generated') {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(info);
      }
    });
  }

  setupRoutes(app) {
    app.post('/generar-suscripcion', this.webSocketController.generarSuscripcion.bind(this.webSocketController));
  }
}

module.exports = WebSocketManager;