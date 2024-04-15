const express = require('express');
const http = require('http');
const readline = require('readline');

const Consumer = require('./consumer');
const WebSocketManager = require('./WebSocketManager');
const WebSocketController = require('./WebSocketController');
const { client, publishNewRequest, changeWorkflowState, newOrquestation } = require('./publisher');

const app = express();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function addSubscribers(){
    await Consumer.connect();
}

// WebSocket Manager Instance
const server = http.createServer(app);
const webSocketController = new WebSocketController(client);
const webSocketManager = new WebSocketManager(server, webSocketController);

// Notification Manager
function startWebSocketServer() {
    webSocketManager.setupRoutes(app);
}

// Views
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Render html index
app.get('/', (req, res) => {
    res.render('index', { title: 'Tafi - Simulacion con Orkes', message: 'Proyecto de simulacion para orkes' });
});

//connect with publish in tafi-events
app.get('/publicar', (req, res) => {
    
    const body = req.body;
    let request;
    switch(body.type){
        case "new_orquestation": request = newOrquestation(req.body.data);
        case "change_workflow_state": request = changeWorkflowState(req.body.data);
        default: 
    }

    publishNewRequest(newOrquestation(request));
    res.send('New request published');
});

//Server start
const port = 3000;
startWebSocketServer();

// Suscriptor registers
addSubscribers();

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});