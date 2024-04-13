const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const grpc = require('grpc');
const readline = require('readline');

const NotesDefinition = grpc.load(require('path').resolve('../proto/notes.proto'));

const client = new NotesDefinition.NoteService('localhost:50051', grpc.credentials.createInsecure());

const app = express();

const suscriptionClient = client.subscribe({});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para enviar notificaciones a todos los clientes conectados
function sendNotification(wss, info = 'New subscription generated') {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(info);
        }
    });
}

// Establecer la ruta para la conexión WebSocket
function startWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');

        // Manejar cierre de la conexión
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    //recibir aqui los eventos de la suscripcion
    suscriptionClient.on('data', (note) => {
        //console.log('recibi data de notas...', note.title);
        sendNotification(wss, note.title);
    });

    suscriptionClient.on('end', () => {
        console.log('Subscription ended');
    });

    // Generar aqui conexione de eventos salientes...
    app.post('/generar-suscripcion', (req, res) => {
        // Generar la suscripción y enviar notificación a los clientes conectados

        const newNote = {
            id: Math.random().toString(36).substring(7),
            title: "Ramon",
            description: "Prueba..." + Math.random().toString(36).substring(7)
        };
        //publicar aqui en el evento..
        client.publish(newNote, (err, response) => {
            if (err) {
                console.error('Error publishing note:', err);
            } else {
                console.log('Note published successfully:', response);
            }
        });

        sendNotification(wss);
        res.send('New subscription generated');
    });

    return wss;
}

// Establecer el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Ruta para renderizar la plantilla HTML
app.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to My Website', message: 'Hello, world!' });
});

app.get('/publicar', (req, res) => {

    const newRequest = {
        id: Math.random().toString(36).substring(7),
        title: "prueba",
        description: "Pruebas123123321"
    };

    client.publish(newRequest, (err, response) => {
        if (err) {
            console.error('Error publishing note:', err);
        } else {
            console.log('Note published successfully:', response);
        }
    });
});

// Iniciar el servidor
const port = 3000;
const server = http.createServer(app);
const wss = startWebSocketServer(server);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
