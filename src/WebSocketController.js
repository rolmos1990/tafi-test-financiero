class WebSocketController {
    constructor(webSocketManager, client) {
      this.webSocketManager = webSocketManager;
      this.client = client;
    }
  
    generarSuscripcion(req, res) {
      const newNote = {
        id: Math.random().toString(36).substring(7),
        title: "Ramon",
        description: "Prueba..." + Math.random().toString(36).substring(7)
      };
  
      this.client.publish(newNote, (err, response) => {
        if (err) {
          console.error('Error publishing note:', err);
        } else {
          console.log('Note published successfully:', response);
        }
      });
  
      this.webSocketManager.sendNotification();
      res.send('New subscription generated');
    }
  }
  
  module.exports = WebSocketController;