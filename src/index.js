const express = require('express');
const http = require('http');
const bodyParser = require('body-parser'); 

const Consumer = require('./consumer');
const WebSocketManager = require('./WebSocketManager');

const app = express();
app.use(bodyParser.json());

async function addSubscribers(webSocketManager){
    await Consumer.connect(webSocketManager);
}

// WebSocket Manager Instance
const server = http.createServer(app);
const webSocketManager = new WebSocketManager(server);

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

//Server start
const port = 3000;
startWebSocketServer();

// Suscriptor registers
addSubscribers(webSocketManager);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});