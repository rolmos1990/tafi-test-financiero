const grpc = require('grpc');
const NotesDefinition = grpc.load(require('path').resolve('../proto/notes.proto'));

const server = new grpc.Server();

// Arreglo para almacenar las notas recibidas del cliente
const notes = [];

// Arreglo para almacenar las conexiones de cliente suscrito
const subscribers = [];

function Publish(call, callback) {
  const newNote = call.request;
  notes.push(newNote);
  callback(null, { success: true });

  // Enviamos la nueva nota a todos los clientes suscritos
  subscribers.forEach(subscriber => {
    subscriber.write(newNote);
  });
}

function Subscribe(call) {
  // Agregamos el cliente a la lista de suscriptores
  subscribers.push(call);

  // Enviamos todas las notas almacenadas al cliente que se suscribe inicialmente
  notes.forEach(note => {
    call.write(note);
  });

  // Manejamos la desuscripción del cliente
  call.on('end', () => {
    console.log('Subscription ended');
    const index = subscribers.indexOf(call);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  });
}

server.addService(NotesDefinition.NoteService.service, { Publish, Subscribe });

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();

console.log('Server started');
