const grpc = require('grpc');

class EventPublisher {
    
    client = null;

    constructor() {
        const EventDefinition = grpc.load(require('path').resolve('./proto/event.proto'));
        this.client = new EventDefinition.event.Event('localhost:7228', grpc.credentials.createInsecure());
    }

    getClient(){
        return this.client;
    }

    changeWorkflowState(id, estado, operacion) {
        const body = { id, estado, operacion };
        return { topic: "tafi-orquestador-flujo-trabajo-estado-cambiado", body };
    }

    newOrquestation(nombre, descripcion, metadata) {
        console.log("generar nueva orquestacion: ", nombre);
        const workFlowId = "WF_SolicitarArchivoDeConciliacion";
        const cronExpression = "0 * * ? * *";

        const body = {
            nombre: nombre,
            descripcion: descripcion,
            dominio: "Financiera",
            subdominio: "Conciliaciones",
            definiciones: {
                metadata: metadata,
                fechaInicio: "2024-04-14",
                fechaFinalizacion: null,
                reglas: [
                    {
                        tipo: ["Ejecucion"],
                        expresiones: [
                            { tipo: "TareaProgramada", valor: [{ tipo: "Cron", valor: cronExpression }, { tipo: "FlujoTrabajo", valor: workFlowId }, { tipo: "VersionFlujoTrabajo", valor: 1 }] }
                        ]
                    }
                ]
            }
        };

        return { topic: "tafi-orquestador-nueva-orquestacion", body };
    }

    editOrquestation(id, nombre, descripcion) {
        const workFlowId = "WF_SolicitarArchivoDeConciliacion";
        const cronExpression = "0 0 1 * * ?";

        const body = {
            id: id,
            nombre: nombre,
            descripcion: descripcion,
            dominio: "Financiera",
            subdominio: "Conciliaciones",
            definiciones: {
                metadata: { entidadFinancieraId: "1234567891" },
                fechaInicio: "2024-04-12",
                fechaFinalizacion: "2024-04-13",
                reglas: [
                    {
                        tipo: ["Ejecucion"],
                        expresiones: [
                            { tipo: "TareaProgramada", valor: [{ tipo: "Cron", valor: cronExpression }, { tipo: "FlujoTrabajo", valor: workFlowId }, { tipo: "VersionFlujoTrabajo", valor: 1 }] }
                        ]
                    }
                ]
            }
        };

        return { topic: "tafi-orquestador-nueva-orquestacion", body };
    }

    async publishNewRequest({ topic, body }) {

        const _today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
        const newRequest = {
            agregadorId: "0057ef53-8e5a-48c3-ade8-b4b971d86f6b",
            agregadorNombre: "Orquestador",
            cuerpoEvento: JSON.stringify(body),
            fechaEvento: _today,
            mensajeId: "0e703ef1-e659-4b5a-8358-9b34ddd6f533",
            tenantId: "Panama",
            tipoEvento: "Evento",
            topico: topic,
            usuarioId: "5c09be80-ca17-4f91-98d9-a950e36081c0"
        };

        console.log("new request..", newRequest);

        return new Promise((resolve, reject) => {
            // Llamar al método del servicio gRPC
            this.client.ProcessEvent(newRequest, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    }
}

module.exports = EventPublisher;