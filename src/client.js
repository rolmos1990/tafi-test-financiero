const grpc = require('grpc');
const readline = require('readline');
const NotesDefinition = grpc.load(require('path').resolve('../proto/notes.proto'));

const client = new NotesDefinition.NoteService('localhost:50051', grpc.credentials.createInsecure());

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para publicar una nueva publicación
function publishNote() {
  rl.question('Enter title of the note: ', (title) => {
    rl.question('Enter description of the note: ', (description) => {
      const newNote = {
        id: Math.random().toString(36).substring(7),
        title: title,
        description: description
      };

      client.publish(newNote, (err, response) => {
        if (err) {
          console.error('Error publishing note:', err);
        } else {
          console.log('Note published successfully:', response);
          startUI(); // Volver al menú inicial
        }
      });
    });
  });
}

// Función para suscribirse a publicaciones
function subscribeToNotes() {
  const call = client.subscribe({});

  call.on('data', (note) => {
    console.log('Received new note:', note);
  });

  call.on('end', () => {
    console.log('Subscription ended');
    startUI(); // Volver al menú inicial
  });
}

// Interfaz de usuario simple
function startUI() {
  console.log('Welcome to the Notes App!');
  console.log('Press "p" to publish a note, or "s" to subscribe to notes.');

  rl.question('> ', (choice) => {
    if (choice === 'p') {
      publishNote();
    } else if (choice === 's') {
      subscribeToNotes();
    } else {
      console.log('Invalid choice. Please try again.');
      startUI();
    }
  });
}

// Iniciar la interfaz de usuario
startUI();
