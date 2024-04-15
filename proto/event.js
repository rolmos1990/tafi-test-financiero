const protobuf = require('protobufjs');

// Cargar el archivo .proto y construir las definiciones
const root = protobuf.loadSync('./event.proto');
const definitions = root.lookup('event');

// Crear una nueva solicitud de evento
const eventRequest = new definitions.EventRequest();
eventRequest.setAgregadorId('agregadorId');
eventRequest.setAgregadorNombre('agregadorNombre');
eventRequest.setTipoEvento('tipoEvento');
eventRequest.setTenantId('tenantId');
eventRequest.setFechaEvento('fechaEvento');
eventRequest.setMensajeId('mensajeId');
eventRequest.setUsuarioId('usuarioId');
eventRequest.setTopico('topico');
eventRequest.setCuerpoEvento('cuerpoEvento');

// Mostrar la solicitud de evento
console.log('[DEBUG] ---------------------------------------------');
console.log('[DEBUG] ~ eventRequest', eventRequest.toJSON());
console.log('[DEBUG] ---------------------------------------------');

// Serializar la solicitud de evento
const serializedEventRequest = definitions.EventRequest.encode(eventRequest).finish();
console.log('[DEBUG] ------------------------------------------------------------------');
console.log('[DEBUG] ~ serializedEventRequest', serializedEventRequest);
console.log('[DEBUG] ------------------------------------------------------------------');

// Deserializar la solicitud de evento
const receivedEventRequest = definitions.EventRequest.decode(serializedEventRequest);
console.log('[DEBUG] --------------------------------------------------------------');
console.log('[DEBUG] ~ receivedEventRequest', receivedEventRequest.toJSON());
console.log('[DEBUG] --------------------------------------------------------------');

// Crear una nueva respuesta de evento
const eventResponse = new definitions.EventResponse();
eventResponse.setSaved(true);
eventResponse.setMessage('Message');

// Mostrar la respuesta de evento
console.log('[DEBUG] ------------------------------------------------------');
console.log('[DEBUG] ~ eventResponse', eventResponse.toJSON());
console.log('[DEBUG] ------------------------------------------------------');

// Serializar la respuesta de evento
const serializedEventResponse = definitions.EventResponse.encode(eventResponse).finish();
console.log('[DEBUG] --------------------------------------------------------------------------');
console.log('[DEBUG] ~ serializedEventResponse', serializedEventResponse);
console.log('[DEBUG] --------------------------------------------------------------------------');

// Deserializar la respuesta de evento
const receivedEventResponse = definitions.EventResponse.decode(serializedEventResponse);
console.log('[DEBUG] --------------------------------------------------------------');
console.log('[DEBUG] ~ receivedEventResponse', receivedEventResponse.toJSON());
console.log('[DEBUG] --------------------------------------------------------------');
