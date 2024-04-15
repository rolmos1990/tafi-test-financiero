const axios = require('axios');
const https = require('https');

class EventPublisher {
    constructor() {
    }

    changeWorkflowState(body) {
        return { topic: "tafi-orquestador-flujo-trabajo-estado-cambiado", body };
    }

    newOrquestation(body) {
        console.log("generar nueva orquestacion: ", body.nombre);
        const workFlowId = "WF_SolicitarArchivoDeConciliacion";
        const cronExpression = "0 * * ? * *";

        const request = {
            nombre: body.nombre,
            descripcion: body.descripcion,
            dominio: "Financiera",
            subdominio: "Conciliaciones",
            definiciones: {
                metadata: body.metadata,
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

        return { topic: "tafi-orquestador-nueva-orquestacion", body: request };
    }

    editOrquestation(body) {
        console.log("generar nueva orquestacion: ", body.nombre);
        const workFlowId = "WF_SolicitarArchivoDeConciliacion";
        const cronExpression = "0 0 1 * * ?";

        const request = {
            id: body.id,
            nombre: body.nombre,
            descripcion: body.descripcion,
            dominio: "Financiera",
            subdominio: "Conciliaciones",
            definiciones: {
                metadata: body.metadata,
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

        return { topic: "tafi-orquestador-nueva-orquestacion", body: request };
    }

    async publishNewRequest({ topic, body }) {
        try {
            const httpsAgent = new https.Agent({ rejectUnauthorized: false });
            const _url = topic === "tafi-orquestador-nueva-orquestacion" ? "https://localhost:7239/orquestacion" : "https://localhost:7130/ejecucion/"+body.id+"/flujo-trabajo/cambiar-estado"
            const response = await axios.post(_url, body, { httpsAgent });

            return response.data; // Devolver la respuesta del servicio dummy
        } catch (error) {
            console.error("Error publishing:", error);
            throw error; // Relanzar el error para que el cliente pueda manejarlo
        }
    }
}

module.exports = EventPublisher;