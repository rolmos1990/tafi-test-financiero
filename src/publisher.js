const grpc = require('grpc');

const NotesDefinition = grpc.load(require('path').resolve('./proto/notes.proto'));
const client = new NotesDefinition.NoteService('localhost:50051', grpc.credentials.createInsecure());

function publishNewRequest() {
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
}

module.exports = {
    client: client,
    publishNewRequest: publishNewRequest
};