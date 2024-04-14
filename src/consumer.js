const { Kafka } = require('kafkajs');

const redpanda = new Kafka({
  clientId: 'financiera-test-app',
  brokers: ['127.0.0.1:9092'],
  ssl: false, // Habilitar SSL si es necesario
  //sasl: {
  //  mechanism: 'PLAIN', // Método de autenticación
  //  username: 'tu-usuario',
  //  password: 'tu-contraseña'
  //},
  requestTimeout: 60000, // MaxPollIntervalMs
  fetchMaxBytes: 1048576,
  fetchWaitMaxMs: 500,
  sessionTimeout: 10000,
  heartbeatInterval: 5000
});

console.log("Inicio esto..");

const groupId = "tafi-orquestador-flujo-de-trabajo-estado-notificacion-group";
const consumer = redpanda.consumer({ groupId });

console.log("Agrego consumer..");

async function connect(onReceiveMessage) {

  console.log("Intento conectarme...");
  try {

  await consumer.connect();
  await consumer.subscribe({ topic: "tafi-orquestador-flujo-de-trabajo-estado-notificacion" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Message: ", message);
      console.log("TOPIC: ", topic);

      let formattedValue;
      if (Buffer.isBuffer(message.value)) {
        formattedValue = JSON.parse(message.value.toString('utf8'));
      } else {
        // Si message.value no es un buffer, maneja el caso según sea necesario
        formattedValue = JSON.parse(message.value);
      }
      //formattedValue .. ejecucion.estadoFlujoTrabajo (Pausado, EnEjecucion), flujoId, configuracion
      onReceiveMessage(topic, formattedValue);
    },
  });

} catch (error) {
  console.error("Error:", error);
}

}

async function disconnect() {
  try {
      await consumer.disconnect();
    } catch (error) {
      console.error("Error:", error);
    }
}

module.exports = {
  connect: connect,
  disconnect: disconnect
};