const WebSocket = require('ws');
const EventPublisher = require("./publisher_http");

class WebSocketManager {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
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
        if(typeof info === "object"){
          client.send(JSON.stringify(info));
        }
        else {
          client.send(info);
        }
      }
    });
  }

  //routes
  async addEvent(req, res) {

    const eventPublisher = new EventPublisher();

    console.log("request: ", req);

    const body = req.body;
    console.log("body..", body);
    let request;
    switch(body.type){
        case "new_orquestation": request = eventPublisher.newOrquestation(body.data);
        break;
        case "change_workflow_state": request = eventPublisher.changeWorkflowState(body.data);
        break;
        default: 
    }

    await eventPublisher.publishNewRequest(request);
    res.send('New event generated');
  }

  setupRoutes(app) {
    app.post('/publicar', this.addEvent.bind(this));
  }
}

module.exports = WebSocketManager;