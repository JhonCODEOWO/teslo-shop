import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface connectedClients {
    //Define un objeto en donde la clave es string y los valores son de tipo Socket es decir una clase de Socket
    [id: string]: Socket
}

@Injectable()
export class MessagesWsService {

    //Los clientes se mantienen en memoria porque son datos volatiles, cada id cambia constantemente dependiendo de quien se conecta
    private connectedClients: connectedClients = { }

    //Método a ejecutar cuando un cliente se conecta
    registerClient(client: Socket){
        //Añadir un nuevo elemento en donde id es string y su valor es un objeto Socket
        this.connectedClients[client.id] = client;
    }

    //Método a ejecutar cuando un cliente se desctonecta
    removeClient(clientId: string){
        //Eliminar una clave del objeto que contiene claves de los clientes conectados
        delete this.connectedClients[clientId];
    }

    //Retorna cantidad de claves en el objeto connectedClients
    getConnectedClients(): number{
        return Object.keys(this.connectedClients).length;
    }
}
